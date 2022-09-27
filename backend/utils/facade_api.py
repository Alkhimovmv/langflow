import os
import json
import requests
from retry import retry

from requests.exceptions import ConnectionError

from typing import List, Dict


class RL:
    "Reinforcement learning service API."

    def __init__(self, service_url: str):
        self.url = service_url

    def get_vec(self, prev_vecs: List) -> Dict:
        """
        Return response with new phrase id.
        """
        endpoint = "/get_pair"
        response = json.loads(
            requests.post(
                self.url + endpoint,
                json={
                    "prev_vecs": prev_vecs,
                },
            ).text
        )
        if response["status"] == 200:
            return response["next_vector"]

        raise Exception(response["traceback"])


class NLP:
    "Natural language processing service API."

    def __init__(self, service_url: str):
        self.url = service_url

    def get_similarity(self, language: str, phrase1: str, phrase2: str) -> Dict:
        """
        Return response with new phrase id.
        """
        endpoint = "/get_similarity"
        response = json.loads(
            requests.get(
                self.url + endpoint,
                json={
                    "language": language,
                    "phrase1": phrase1,
                    "phrase2": phrase2,
                },
            ).text
        )
        if response["status"] == 200:
            return {
                "is_equal": response["is_equal"],
                "equality_rate": response["equality_rate"],
                "differences": response["differences"],
            }

        raise Exception(response["traceback"])

    def get_phrase_vector(self, language: str, phrase: str) -> Dict:
        """
        Return response with new phrase id.
        """
        endpoint = "/get_phrase_vector"
        response = json.loads(
            requests.get(
                self.url + endpoint,
                json={
                    "language": language,
                    "phrase": phrase,
                },
            ).text
        )

        vector = [float(f) for f in response["vector"][1:-1].split()]
        if response["status"] == 200:
            return {"vector": vector}

        raise Exception(response["traceback"])


class FacadeAPI:
    def __init__(self, rl_url: str = None, nlp_url: str = None):
        self.rl_service = RL(rl_url)
        self.nlp_service = NLP(nlp_url)

    @retry(ConnectionError, tries=5, delay=5)
    def rl_get_next_vec(self, prev_vecs: List) -> Dict:
        if not self.rl_service:
            raise TypeError("RL service url hasn't been defined")
        return self.rl_service.get_vec(prev_vecs)

    @retry(ConnectionError, tries=5, delay=5)
    def nlp_get_similarity(self, language: str, phrase1: str, phrase2: str) -> Dict:
        if not self.nlp_service:
            raise TypeError("NLP service url hasn't been defined")
        return self.nlp_service.get_similarity(language, phrase1, phrase2)

    @retry(ConnectionError, tries=5, delay=5)
    def nlp_get_phrase_vector(self, language: str, phrase: str) -> Dict:
        if not self.nlp_service:
            raise TypeError("NLP service url hasn't been defined")
        return self.nlp_service.get_phrase_vector(language, phrase)
