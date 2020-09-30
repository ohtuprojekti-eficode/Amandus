import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildContext } from 'graphql-passport'
import { createServer } from 'http'
import cors from 'cors'

import passport from '../utils/passport'
import config from '../utils/config'
import User from '../types/user'

import schema from './schema/schema'

const app = express()

const corsOptions:cors.CorsOptions = {
  origin: '*',
  credentials: true
}

app.use(passport.initialize())
app.use(passport.session()) // if session is used

const server = new ApolloServer({
  schema: schema,
  context: ({ req, res }) => buildContext({ req, res, User })
})

server.applyMiddleware({ app, path: '/graphql', cors: { credentials: true, origin: true } })
server.applyMiddleware({ app, cors: corsOptions })

const httpServer = createServer(app)

httpServer.listen(
  { port: config.PORT },
  (): void => console.log(`GraphQL is now running on http://localhost:${config.PORT}/graphql`)
)