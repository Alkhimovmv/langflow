FROM python:3.7-buster

RUN pip install --upgrade pip

WORKDIR /nlp_module

COPY requirements.txt .

RUN pip install -r requirements.txt
