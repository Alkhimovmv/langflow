import os
import difflib
from colorama import Fore, Style

MISTAKE_TRESHOLD = 5


def show_differences(real_answer: str, user_answer: str) -> str:
    """
    Function shows difference between the users answer and the correct one
    """
    if (
        sum([1 for f in difflib.ndiff(real_answer, user_answer) if f[0] != " "])
        > MISTAKE_TRESHOLD
    ):
        return f"{Fore.GREEN}{real_answer}{Style.RESET_ALL}"

    fixed_string = ""
    difference_iterator = difflib.ndiff(real_answer, user_answer)
    for f in difference_iterator:
        if f[0] == " ":
            fixed_string += f[-1]
        elif f[0] == "+":
            fixed_string += f"{Fore.RED}{f[-1].capitalize()}{Style.RESET_ALL}"
        elif f[0] == "-":
            fixed_string += f"{Fore.GREEN}{f[-1].capitalize()}{Style.RESET_ALL}"
    return fixed_string
