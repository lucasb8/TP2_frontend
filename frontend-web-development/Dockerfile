FROM node:12-alpine

WORKDIR /app

RUN apk add mariadb-client git dos2unix curl
RUN npm install -g typescript

RUN curl -s https://raw.githubusercontent.com/eficode/wait-for/v1.1.0/wait-for -o /bin/wait-for
RUN chmod +x /bin/wait-for

ADD . /app
RUN rm -rf node_modules build coverage .nyc_output

RUN npm install
RUN tsc
RUN node build/server/apidoc.js

# see https://willi.am/blog/2016/08/11/docker-for-windows-dealing-with-windows-line-endings/
RUN dos2unix index.sh && apk del dos2unix

CMD ["sh", "index.sh"]
