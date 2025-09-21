FROM python:3.13-slim
LABEL authors="Acie"
WORKDIR /backend

COPY ./requirements.txt /files/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /files/requirements.txt
COPY . .

VOLUME /data

EXPOSE 8000

CMD ["fastapi", "run", "main.py", "--port", "8000"]
