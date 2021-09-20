import os


def compare_answers(real_answer: str, user_answer: str) -> bool:
    """
    This function compares answer and makes an inference
    about of equality
    """
    return user_answer.lower() == real_answer.lower()
