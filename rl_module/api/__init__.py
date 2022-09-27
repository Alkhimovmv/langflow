from flask import Blueprint

from src.agent import Agent

agent = Agent()

api = Blueprint("api", __name__)

from .get_pair import get_pair_api
