import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildContext } from 'graphql-passport'
import { createServer } from 'http'

import passport from '../utils/passport'
import config from '../utils/config'
import User from '../types/user'

import schema from './schema/schema'

const app = express()

const corsOptions = {
  origin: true,
  credentials: true
}

app.use(passport.initialize())
app.use(passport.session()) // if session is used

const server = new ApolloServer({
  schema: schema,
  context: ({ req, res }) => buildContext({ req, res, User })
})

server.applyMiddleware({ app, path: '/graphql' })
server.applyMiddleware({ app, cors: corsOptions })

const httpServer = createServer(app)

httpServer.listen(
  { port: config.PORT },
  (): void => console.log(`GraphQL is now running on http://localhost:${config.PORT}/graphql`)
)