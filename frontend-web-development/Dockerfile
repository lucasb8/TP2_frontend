FROM node:12-alpine

WORKDIR /app

RUN npm install -g typescript

ADD . /app

RUN npm install
RUN tsc
RUN node build/server/apidoc.js
RUN npm prune --production

CMD ["node", "--async-stack-traces", "index"]
