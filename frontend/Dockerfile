FROM node:14-alpine

RUN mkdir -p /usr/src/frontend/node_modules && \
  chown -R node:node /usr/src/frontend

WORKDIR /usr/src/frontend

USER node

COPY --chown=node:node . .
RUN yarn && yarn build && yarn add serve

EXPOSE 3000

CMD ["yarn","start"]