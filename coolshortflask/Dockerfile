FROM python:3.10.8-alpine3.16
WORKDIR /usr/src/app

COPY /coolshortflask/requirements.txt ./
RUN pip install -r requirements.txt
COPY /coolshortflask .
COPY ../project.env ./.env

EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]