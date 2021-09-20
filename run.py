import os
import sys
import numpy as np
import pandas as pd
from colorama import Fore, Style

# Programm iterates over existed data and
# shows you sentences which should be translated
# by you

print(
    """\
Hello! Choose language pair you want to learn!
    1. english-french
    2. russian-english
    3. french-english
"""
)
session_learning_language = {
    1: "english-french",
    2: "russian-english",
    3: "french-english",
}[int(input())]

print(f"You have choosed: {session_learning_language}")

# get access to data
pairs = []
with open(f"data/{session_learning_language}/sentences_pairs.txt", "r") as data:
    for line in data:
        pair = [i.strip() for i in line.split("-")]
        pairs.append(pair)

users_answer = None
while 1:
    choosed_pair = pairs[np.random.choice(len(pairs))]
    if users_answer and users_answer == choosed_pair:
        continue
    print(f"Phrase: {Fore.YELLOW}{choosed_pair[0]}{Style.RESET_ALL}")
    print(f"Transl: ", end="")
    users_answer = input()
    if users_answer == choosed_pair[1]:
        print(f"Good. {Fore.GREEN}Right answer!{Style.RESET_ALL}")
    else:
        print(f"Bad. Answer is: {Fore.RED}{choosed_pair[1]}{Style.RESET_ALL}")
