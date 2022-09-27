import traceback

from flask import request, jsonify
from flasgger.utils import swag_from

from . import api, session


@api.route("/question", methods=["POST"])
@swag_from("swaggers/question_api.yml")
def question_api():
    """
    Generate question for particular user
    """
    try:
        # auth token
        session_token = request.headers.get("session_token")
        # request body
        req = request.get_json()
        first_language = req["first_language"]
        second_language = req["second_language"]
        level = int(req["level"])

        # get uuid using session_token
        uuid = session.get_user_uuid(session_token)

        (
            question_token,
            first_language_phrase,
            second_language_phrase,
        ) = session.generate_phrase_pair(uuid, first_language, second_language, level)

        return jsonify(
            {
                "status": 200,
                "question_token": question_token,
                "question": first_language_phrase,
                "answer": second_language_phrase,
            }
        )
    except Exception as e:
        return jsonify(
            {
                "status": 500,
                "message": f"Server internal error. {e}",
                "traceback": f"{traceback.format_exc()}",
            }
        )
