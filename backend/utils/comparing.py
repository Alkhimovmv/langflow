import os
import gzip
import shutil
import fasttext
import numpy as np
from scipy.spatial.distance import cosine

from typing import List

CORRECTNESS_RATE = 0.98

PATH_TO_MODELS = "language_models/"


def load_language_model(model_name, extension="gz"):
    """
    Models are stored as .bit.tar.gz
    Fore session working they are needed to be extracted
    """
    model_name_ext = f"{model_name}5.bin"
    archive_path = os.path.join(PATH_TO_MODELS, f"{model_name_ext}.{extension}")
    model_path = os.path.join(PATH_TO_MODELS, f"{model_name_ext}")

    if model_name_ext not in os.listdir(PATH_TO_MODELS):
        with gzip.open(archive_path, "rb") as file_in:
            with open(model_path, "wb") as file_out:
                shutil.copyfileobj(file_in, file_out)

    return fasttext.load_model(model_path)


def normalize_form_of_answer(answer: str) -> str:
    """
    Normalize string to the single form which are
    equal in any case of writing style.
    """
    answer = answer.lower().strip()

    symbols_to_ignore = "!@#$%^&?,.:;"
    for symb in symbols_to_ignore:
        answer = answer.replace(symb, "")
    return answer


def tokenize_answer(answer: str) -> List:
    """
    Tokenize sentence
    """
    tokens = answer.split() if len(answer) > 0 else []
    return tokens


def get_phrase_vector(language_model, phrase_tokens, approach=None):
    """
    Get phrase vector using language model which provides each
    containing token embedding
    """
    if not approach:
        phrase_vec = language_model.get_sentence_vector(" ".join(phrase_tokens))
    elif approach == "mean":
        phrase_tokes_vec = [language_model[tok] for tok in phrase_tokens]
        phrase_vec = np.mean(phrase_tokens, axis=0)
    return phrase_vec


def get_similarity(vec1, vec2, metric="cosine"):
    """
    Calculate semantic closeness using choosed metric function
    """
    if metric == "cosine":
        return 1 - cosine(vec1, vec2)
    raise ValueError(f"Unknown distance metric <{metric}>")


def get_equality_rate(language_model, real_answer: str, user_answer: str) -> float:
    """
    Get equality_rate between users
    """
    if not user_answer:
        return 0.0
    real_answer_tokens = tokenize_answer(real_answer)
    user_answer_tokens = tokenize_answer(user_answer)
    equality_rate = get_similarity(
        get_phrase_vector(language_model, real_answer_tokens),
        get_phrase_vector(language_model, user_answer_tokens),
    )
    return equality_rate


def compare_answers(language, real_answer: str, user_answer: str) -> bool:
    """
    This function compares answer and makes an inference
    about of equality
    """
    language_model = load_language_model(language)
    real_answer = normalize_form_of_answer(real_answer)
    user_answer = normalize_form_of_answer(user_answer)

    equality_rate = get_equality_rate(language_model, real_answer, user_answer)
    is_equal = 1 if equality_rate >= CORRECTNESS_RATE else 0

    comparing_result = {
        "is_equal": is_equal,
        "equality_rate": equality_rate,
    }
    return comparing_result