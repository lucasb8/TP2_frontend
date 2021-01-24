FROM node:12-alpine

WORKDIR /app

RUN apk add mariadb-client git
RUN npm install -g typescript

ADD . /app
RUN rm -rf node_modules build coverage .nyc_output

RUN npm install
RUN tsc
RUN node build/server/apidoc.js

CMD ["sh", "index.sh"]
