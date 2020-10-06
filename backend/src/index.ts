import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import config from '../utils/config'
import schema from './schema/schema'

import { Req } from '../types/request'
import User from './model/user'

const app = express()

const corsOptions = {
  origin: true,
  credentials: true
}

const server = new ApolloServer({
  schema: schema,
  context: ({ req }: Req) => {
    const auth = req.headers.authorization
    if ( auth && auth.toLowerCase().startsWith('bearer') ) {
      const gitHubId = auth.substring(7) // using github id for now
      const currentUser = User.getUserByGithubId(gitHubId)
			return { currentUser }
    }
    
    return null
  }
})

server.applyMiddleware({ app, path: '/graphql' })
server.applyMiddleware({ app, cors: corsOptions })

const httpServer = createServer(app)

httpServer.listen(
  { port: config.PORT },
  (): void => console.log(`GraphQL is now running on http://localhost:${config.PORT}/graphql`)
)