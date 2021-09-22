import os
import sys
import numpy as np
import pandas as pd
from colorama import Fore, Style

from collections import Counter
from utils.tips import show_differences
from utils.comparing import compare_answers

# Programm iterates over existed data and
# shows you sentences which should be translated
# by you
SESSION_PHRASES_COUNTER = 5
LEARNING_LANGS = {
    1: "english",
    2: "russian",
    3: "french",
}
AVAILABLE_LEVELS = {
    1: "level1",
}


def get_session(first_lang, second_lang, level):
    """
    Session itself. User choose session_learning_language parameter
    which defines which dataset to use for known and learning language
    """
    # get access to data
    pairs = pd.read_csv(f"data/{level}.csv", usecols=[first_lang, second_lang])[
        [first_lang, second_lang]
    ].values

    bad_answers_counter = Counter()
    actions_counter = 0
    user_answer = None
    while 1:
        actions_counter += 1
        first_lang, second_lang = pairs[np.random.choice(len(pairs))]
        phrase = f"{Fore.YELLOW}{first_lang}{Style.RESET_ALL}"
        print(f"{{:<20}} >> {{}}".format(f"Phrase #{actions_counter}", phrase))
        print(f"{{:<20}} >> ".format("Translate"), end="")
        user_answer = input()

        if compare_answers(second_lang, user_answer):
            second_lang = f"{Fore.GREEN}{second_lang}{Style.RESET_ALL}"
            print(f"{{:<20}}\n".format("Right answer!"), end="")
        else:
            bad_answers_counter.update([f"{first_lang}->{second_lang}"])
            differences = show_differences(second_lang, user_answer)
            print(f"{{:<20}} >> {{}}".format("Bad answer", differences))
            print(f"{{:<20}} >> ".format("Repeat please"), end="")
            differences = show_differences(second_lang, input())
            print(f"{{:<20}} >> {{}}".format("Well!", differences))
        print()

        if actions_counter == SESSION_PHRASES_COUNTER:

            # Show 5 most frequent errors
            print("While practicing the most common mistakes:")
            for bad_answer, n_errors in bad_answers_counter.most_common(5):
                bad_answer_first, bad_answer_second = bad_answer.split("->")
                print(
                    f"({n_errors}) {Fore.YELLOW}{bad_answer_first}{Style.RESET_ALL} "
                    + f": {Fore.GREEN}{bad_answer_second}{Style.RESET_ALL}"
                )

            print("\nWould you like to keep practicing?)")
            print("Press y/N")
            if input() != "y":
                return 0
            print("Ok! Here we go!)")
            actions_counter = 0


def main():
    """
    Welcomes user and launch session with choosed setting
    """
    print(
        f"""\
    Hello! Choose language pair you want to learn!
    Among next available languages:
    {LEARNING_LANGS}

    and starting level:
    {AVAILABLE_LEVELS}
    """
    )
    first_lang = LEARNING_LANGS[int(input("First language id : "))]
    second_lang = LEARNING_LANGS[int(input("Second language id: "))]
    level = AVAILABLE_LEVELS[int(input("Level id: "))]
    print(
        f"Cool! You have choosed: {Fore.GREEN}[{first_lang}-{second_lang}]{Style.RESET_ALL}"
    )
    try:
        get_session(first_lang, second_lang, level=level)
        print("Well, session is DONE then! Good luck!")
    except KeyboardInterrupt:
        print("Stopping session softly.")


if __name__ == "__main__":
    main()
