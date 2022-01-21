FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY ./requirements.txt /requirements.txt
COPY ./src /code
RUN pip install -r /requirements.txt

WORKDIR /code

# [Security] Limit the scope of user who run the docker image
RUN adduser -D user

USER user