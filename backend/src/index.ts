import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { verify } from 'jsonwebtoken'

import config from './utils/config'
import schema from './schema/schema'

import { Req } from './types/request'
import User from './model/user'
import path from 'path'

const app = express()

const corsOptions = {
  origin: true,
  credentials: true,
}

interface TokenType {
  gitHubId: string
}
const server = new ApolloServer({
  schema,
  context: ({ req }: Req) => {
    const auth = req && req.headers.authorization
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = verify(auth.substring(7), config.JWT_SECRET)
      const currentUser = User.getUserByGithubId(
        (<TokenType>decodedToken).gitHubId
      )
      return { currentUser }
    }
    return
  },
})

server.applyMiddleware({ app, path: '/graphql' })
server.applyMiddleware({ app, cors: corsOptions })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build/frontBuild'))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../build/frontBuild/index.html'))
  })
}

if (process.env.NODE_ENV !== 'test') {
  const httpServer = createServer(app)

  httpServer.listen({ port: config.PORT }, (): void =>
    console.log(
      `GraphQL is now running on http://localhost:${config.PORT}/graphql`
    )
  )
}


export {
  server
}