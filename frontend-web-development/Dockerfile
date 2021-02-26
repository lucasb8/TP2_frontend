FROM node:12-alpine

WORKDIR /app

RUN apk add mariadb-client git dos2unix
RUN npm install -g typescript

ADD . /app
RUN rm -rf node_modules build coverage .nyc_output

RUN npm install
RUN tsc
RUN node build/server/apidoc.js

# see https://willi.am/blog/2016/08/11/docker-for-windows-dealing-with-windows-line-endings/
RUN dos2unix index.sh && apk del dos2unix

CMD ["sh", "index.sh"]
