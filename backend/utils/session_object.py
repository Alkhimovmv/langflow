import os
import uuid
import numpy as np
import pandas as pd
from collections import Counter
from typing import Tuple
from sqlalchemy import and_, or_, not_
from sqlalchemy import text as sql_text_query

from dbase import db
from dbase.actions import Action
from dbase.phrases import Phrase, PhraseVector
from dbase.users import UserAuthorized, UserAnon, UserVector

from utils.facade_api import FacadeAPI
from utils.faiss import get_closest_vector_knn
from utils.constants import RL_SERVICE_URL, NLP_SERVICE_URL, N_MAX_USERS

# set other services connection
facade_api = FacadeAPI(
    rl_url=RL_SERVICE_URL,
    nlp_url=NLP_SERVICE_URL,
)


def generate_random_token(type: str) -> str:
    """
    Generate unique encoded string

    :param type: the encoding type which should be applied

    :return: the generated encoding string
    """
    if type == "uuid4":
        return uuid.uuid4()
    elif type == "os_8":
        return os.urandom(8).hex()
    else:
        raise KeyError(f"Unknown encoding type <{type}>")


def chec_if_token_uuid(string_to_check: str) -> bool:
    try:
        check = string_to_check == str(uuid.UUID(string_to_check))
    except ValueError:
        return False
    return check


class SessionController:
    """
    Session object which contains session parameters
    for correct question formatting and question selection

    :param n_jobs: the number of simultaneously used cores for processing. If the
     value is defined as -1 then all available cpu cores are used.
    """

    def __init__(self, n_jobs: int = -1):
        self.n_jobs = n_jobs

    @staticmethod
    def create_user(username: str, password: str, email: bool) -> Tuple[str, bool]:
        """
        Create new authorized user in base.

        :param username: Provided username.
        :param password: Provided password.
        :param email: User email to contact.

        :return: Final status code and message.
        """
        # check if the username is already exists
        user = db.session.query(UserAuthorized).filter(
            or_(
                UserAuthorized.username == username,
                UserAuthorized.email == email,
            )
        )
        if user.first() is not None:
            return 409, f"Username <{username}> and/or email <{email}> already exist"

        # create new user
        uuid_generated = generate_random_token("uuid4")
        user = UserAuthorized(
            username=username,
            password=password,
            email=email,
            uuid=uuid_generated,
            session_token=None,
        )
        db.session.add(user)
        db.session.commit()

        user_vec = UserVector(
            uuid=uuid_generated,
            english=np.random.rand(8),
            french=np.random.rand(8),
            russian=np.random.rand(8),
            ukrainian=np.random.rand(8),
        )
        db.session.add(user_vec)
        db.session.commit()

        return 200, f"User <{username}> was created!"

    @staticmethod
    def activate_session_token(
        username: str, password: str, is_anon: bool
    ) -> Tuple[str, bool]:
        """
        Activate user session

        :param username: Provided username.
        :param password: Provided password.
        :param is_anon: User work as anonimous user or authorized flag.

        :return: Tuple of values - status code and generated token.
        """
        session_token_generated = generate_random_token("os_8")

        if is_anon:
            # create anon user and set session token
            uuid_generated = generate_random_token("uuid4")
            user = UserAnon(
                username=username,
                uuid=uuid_generated,
                session_token=session_token_generated,
            )
            db.session.add(user)
            db.session.commit()

            user_vec = UserVector(
                uuid=uuid_generated,
                english=np.random.rand(8),
                french=np.random.rand(8),
                russian=np.random.rand(8),
                ukrainian=np.random.rand(8),
            )
            db.session.add(user_vec)
            db.session.commit()
        else:
            # find existed user and set session token
            user = db.session.query(UserAuthorized).filter(
                and_(
                    UserAuthorized.username == username,
                    UserAuthorized.password == password,
                )
            )
            if user.first() is not None:
                user.update({"session_token": session_token_generated})
                db.session.commit()
            else:
                raise ValueError("Wrong username or password")

        return 200, session_token_generated

    @staticmethod
    def get_user_uuid(session_token: str) -> str:
        """
        Get user unique id (uuid) from users table.

        :param session_token: active session token from server side.

        :return: uuid of user from base.
        """
        authorized_user = db.session.query(UserAuthorized.uuid).filter(
            UserAuthorized.session_token == session_token
        )
        if authorized_user.first() is not None:
            return str(authorized_user.scalar())

        anon_user = db.session.query(UserAnon.uuid).filter(
            UserAnon.session_token == session_token
        )
        if anon_user.first() is not None:
            return str(anon_user.scalar())

        raise ValueError("Defined session token does not exist!")

    @staticmethod
    def get_question_quid(quid_token: str) -> str:
        """
        Get user unique id (uuid) from users table.

        :param quid_token: the question token server side

        :return: quid from base
        """
        quid = (
            db.session.query(Action.quid)
            .filter(Action.quid_token == quid_token)
            .scalar()
        )
        return str(quid)

    @staticmethod
    def select_question(
        uuid: str,
        first_language: str,
        second_language: str,
        level: int,
        n_previous_phrases: int = 5,
    ) -> Tuple[str, str, str]:
        """
        Smart question selection

        :param uuid: the uuid of user which asks to get the question
        :param first_language: the language which is known by user
        :param second_language: the language which is learning by user
        :param level: the level which defined the hardness of the asked phrase

        :return: tuple which consts of question id, and phrase on two languages
        """

        # check if uuid is correct, to avoid sql injection
        assert chec_if_token_uuid(uuid), f"UUID is bad: '{uuid}'"

        previous_phrases_vecs_query = sql_text_query(
            f"""
            with phrases_ids as (
                SELECT phrase_id
                FROM actions
                WHERE uuid = '{uuid}'
                ORDER BY action_date DESC
                LIMIT {n_previous_phrases}
            )

            SELECT t2.{second_language} as vecs
            FROM phrases_ids as t1
            JOIN phrases_vec as t2
            ON t1.phrase_id = t2.id
            """
        )
        query_iterable = db.engine.execute(previous_phrases_vecs_query).all()
        prev_vecs = [row["vecs"] for row in query_iterable]

        if len(prev_vecs):
            # RL WORKS HERE
            predicted_vec = facade_api.rl_get_next_vec(prev_vecs)

            next_ids, next_dists = get_closest_vector_knn(
                second_language, predicted_vec
            )
            choices = np.random.multinomial(
                1, (next_dists.max() - next_dists) / next_dists.sum()
            )
            phrase_id = int(next_ids[choices.argmax()])
        else:
            phrase_id = 1

        flang = str(
            db.session.query(getattr(Phrase, first_language))
            .filter(Phrase.id == phrase_id)
            .scalar()
        )
        slang = str(
            db.session.query(getattr(Phrase, second_language))
            .filter(Phrase.id == phrase_id)
            .scalar()
        )

        flang, slang = flang.lower().capitalize(), slang.lower().capitalize()
        return phrase_id, flang, slang

    def generate_phrase_pair(
        self, uuid: str, first_language: str, second_language: str, level: int
    ) -> Tuple[str, str]:
        """
        Choose pair of phrases randomly

        :param uuid: the uuid of user which asks to get the question
        :param first_language: the language which is known by user
        :param second_language: the language which is learning by user
        :param level: the level which defined the hardness of the asked phrase

        :return: the tuple of three values with question id and phrase on two languages
        """
        # smart selection
        phrase_id, flang, slang = self.select_question(
            uuid, first_language, second_language, level
        )

        # generate question id and token
        quid_generated = generate_random_token("uuid4")
        quid_token_generated = generate_random_token("os_8")

        # record action in base
        action = Action(
            uuid=uuid,
            quid=quid_generated,
            quid_token=quid_token_generated,
            phrase_id=phrase_id,
            level=level,
            first_language=first_language,
            second_language=second_language,
            user_answer=None,
            score=None,
        )
        db.session.add(action)
        db.session.commit()

        return quid_token_generated, flang, slang

    def get_user_phrases(self, uuid: str, quid: str) -> Tuple[str, str, str, str]:
        """
        Get particular question of particular user

        :param uuid: the user id for existed pair selection
        :param quid: the question id for existed pair selection

        :return: the tuple of four values with languages names and phrase on both of themh
        """

        row = (
            db.session.query(Action)
            .filter(and_(Action.quid == quid, Action.uuid == uuid))
            .scalar()
        )
        phrase_id = row.phrase_id
        flang = row.first_language
        slang = row.second_language

        phrases = db.session.query(Phrase).filter(Phrase.id == phrase_id).scalar()

        flang_phrase = getattr(phrases, flang)
        slang_phrase = getattr(phrases, slang)

        return phrase_id, flang, flang_phrase, slang, slang_phrase

    @staticmethod
    def compare_answers(language, phrase1, phrase2):
        """
        Compare phrases using NLP service.
        """
        return facade_api.nlp_get_similarity(language, phrase1, phrase2)

    def record_users_result(self, uuid: str, quid: str, user_answer: str, score: float):
        """
        Set question status of user

        :param uuid: the user id to record in the table of actions
        :param quid: the question id to record in the table of actions
        :param user_answer: the user answer to record in the table of action
        :param score: the user's answer score to record in the table of actions
        """
        db.session.query(Action).filter(
            and_(Action.quid == quid, Action.uuid == uuid)
        ).update({"user_answer": user_answer, "score": round(score, 3)})
        db.session.commit()

    def update_user_vec(
        self,
        phrase_id: str,
        uuid: str,
        slang: str,
        score: float,
        gamma: float = 0.5,
        score_threshold: float = 0.75,
    ):
        """
        Update user's vector
        """
        user_vec = db.session.query(UserVector).filter(UserVector.uuid == uuid)
        phrase_vec = db.session.query(PhraseVector).filter(PhraseVector.id == phrase_id)

        user_vec_ar = np.array(getattr(user_vec.scalar(), slang))
        phrase_vec_ar = np.array(getattr(phrase_vec.scalar(), slang))

        user_vec_ar += gamma * (score - score_threshold) * (user_vec_ar - phrase_vec_ar)

        user_vec.update({slang: user_vec_ar})
        db.session.commit()

    def get_user_analysis(self, uuid: str) -> dict:
        """
        Get user's session analysis

        :param uuid: the user id to analyze

        :return: dictionary of the main info about user's success
        """
        # retrieve info from base
        actions = [
            {"second_language": r.second_language, "score": r.score}
            for r in db.session.query(
                Action.second_language,
                Action.score,
            ).filter(Action.uuid == uuid)
        ]
        slangs = [a["second_language"] for a in actions]
        scores = [a["score"] for a in actions]

        # count target values frequency
        slangs_counts = dict(Counter(slangs))

        # collect stats how user successfully stidy
        answered_questions = [s for s in scores if s is not None]
        answered_questions_number = len(answered_questions)
        unanswered_questions_number = len(scores) - len(answered_questions)
        average_score = np.mean(answered_questions)
        message = "Study more, lazy boy!"

        return (
            slangs_counts,
            answered_questions,
            answered_questions_number,
            unanswered_questions_number,
            average_score,
            message,
        )
