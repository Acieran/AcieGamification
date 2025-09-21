FROM node:20-alpine

WORKDIR /frontend

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port=8080"]
