FROM node:14-alpine

RUN mkdir -p /usr/src/app/node_modules && \
  chown -R node:node /usr/src/app

WORKDIR /usr/src/app
RUN apk add git

USER node

COPY --chown=node:node . .

EXPOSE 3001

CMD ["yarn","dev"]
