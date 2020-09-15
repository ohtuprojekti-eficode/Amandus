FROM node:14-alpine

RUN mkdir -p /usr/src/app/node_modules && \
  chown -R node:node /usr/src/app

WORKDIR /usr/src/app

USER node

COPY --chown=node:node . .
RUN yarn

EXPOSE 3000

CMD ["yarn","start"]