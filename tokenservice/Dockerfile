FROM node:14-alpine

RUN mkdir -p /usr/src/tokenservice/node_modules && \
  chown -R node:node /usr/src/tokenservice

WORKDIR /usr/src/tokenservice

COPY --chown=node:node . .

EXPOSE 3002

CMD ["yarn","dev"]
