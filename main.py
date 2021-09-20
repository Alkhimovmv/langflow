import os
import sys
import numpy as np
import pandas as pd
from colorama import Fore, Style

from utils.tips import show_differences
from utils.comparing import compare_answers

# Programm iterates over existed data and
# shows you sentences which should be translated
# by you
LEARNING_PAIRS = {
    1: "english-french",
    2: "russian-english",
    3: "french-english",
}


def get_session(session_learning_language):
    """
    Session itself. User choose session_learning_language parameter
    which defines which dataset to use for known and learning language
    """
    # get access to data
    pairs = pd.read_csv(f"data/{session_learning_language}/level1.csv").values

    user_answer = None
    while 1:
        first_lang, second_lang = pairs[np.random.choice(len(pairs))]
        print(f"Phrase    \t>> {Fore.YELLOW}{first_lang}{Style.RESET_ALL}")
        print(f"Translate \t>> ", end="")
        user_answer = input()
        if compare_answers(second_lang, user_answer):
            print(f"\rGood.        \t>> {Fore.GREEN}{second_lang}{Style.RESET_ALL}")
        else:
            print(f"Bad. Answer is:\t>> {show_differences(second_lang, user_answer)}")
        print()


if __name__ == "__main__":
    print(
        f"""\
    Hello! Choose language pair you want to learn!
    {LEARNING_PAIRS}
    """
    )
    session_learning_language = LEARNING_PAIRS[int(input())]
    print(
        f"Cool! You have choosed: {Fore.GREEN}{session_learning_language}{Style.RESET_ALL}"
    )
    try:
        get_session(session_learning_language)
    except KeyboardInterrupt:
        print("Stopping session softly..")
