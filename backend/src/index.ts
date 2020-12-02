import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import { verify } from 'jsonwebtoken'
import cors from 'cors'
import { readFileSync } from 'fs'

import config from './utils/config'
import schema from './schema/schema'

import { Req } from './types/request'
import User from './model/user'
import path from 'path'
import { UserJWT } from './types/user'

const app = express()

app.use(cors())

const corsOptions = {
  origin: true,
  credentials: true,
}

const server = new ApolloServer({
  schema,
  context: async ({ req }: Req) => {
    const auth = req && req.headers.authorization
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = <UserJWT>verify(auth.substring(7), config.JWT_SECRET)
      const currentUser = await User.getUserById(decodedToken.id)
      const githubToken = decodedToken.githubToken
      return { currentUser, githubToken }
    }
    return
  },
})

server.applyMiddleware({ app, path: '/graphql' })
server.applyMiddleware({ app, cors: corsOptions })

app.get('/onig', (_req, res) => {
  const wasmFile = readFileSync(
    `${__dirname}/../node_modules/vscode-oniguruma/release/onig.wasm`
  )
  res.setHeader('content-type', 'application/wasm')
  res.send(wasmFile)
})

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

export { server }
