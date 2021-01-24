FROM node:12-alpine

WORKDIR /app

RUN apk add mariadb-client
RUN npm install -g typescript

ADD . /app

RUN npm install
RUN tsc
RUN node build/server/apidoc.js

CMD ["sh", "index.sh"]
