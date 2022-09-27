import os

# Reinforcement learning service
RL_SERVICE_URL = os.environ.get("RL_SERVICE_URL")

# Natural language processing service
NLP_SERVICE_URL = os.environ.get("NLP_SERVICE_URL")

# Postgres db service
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

POSTGRES_NAME = os.environ.get("POSTGRES_NAME")
POSTGRES_USERNAME = os.environ.get("POSTGRES_USERNAME")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")


# Additional configs
N_MAX_USERS = int(os.environ.get("N_MAX_USERS"))
