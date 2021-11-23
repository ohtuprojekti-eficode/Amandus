import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import jwt, { verify } from 'jsonwebtoken'
import cors from 'cors'
import { readFileSync } from 'fs'

import { createTokens } from './utils/tokens'

import config from './utils/config'
import schema from './schema/schema'

//import { Req } from './types/request'
import User from './model/user'
import path from 'path'
import { UserJWT } from './types/user'
import { initTestRepo } from './utils/testUtil'

// import { RegisterUserInput } from './types/params'
const app = express()

app.use(cors())

const corsOptions = {
  origin: true,
  credentials: true,
}

const server = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    const accessToken: any = req && req.headers['x-access-token']
    const refreshToken: any = req && req.headers['x-refresh-token']

    if (!accessToken || !refreshToken) return

    try {
      // client is accessing with non-expired access token...
      const decodedAccessToken = <UserJWT>verify(accessToken, config.JWT_SECRET)
      if (!decodedAccessToken.id) return

      const currentUser = await User.getUserById(decodedAccessToken.id)
      if (!currentUser) return

      return { currentUser }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        // trying to access with expired access token...
        try {
          const decodedRefreshToken = <UserJWT>(
            verify(refreshToken, config.JWT_SECRET)
          )
          if (!decodedRefreshToken.id) return

          const currentUser = await User.getUserById(decodedRefreshToken.id)
          if (!currentUser) return

          // todo: token has been revoked
          // if (currentUser.refreshTokenCount !== decodedRefreshToken.count) return

          // generate new tokens for the user
          const newTokens = createTokens(currentUser)

          // send new tokens to the client in headers
          res.set({
            'Access-Control-Expose-Headers': 'x-access-token,x-refresh-token',
            'x-access-token': newTokens.accessToken,
            'x-refresh-token': newTokens.refreshToken,
          })

          return { currentUser }
        } catch (e) {
          // client is accessing with expired access token and refresh token...
          if (e instanceof jwt.TokenExpiredError) return
          throw e
        }
      } else {
        throw e
      }
    }
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

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'e2etest'
) {
  app.use(express.static('build/frontBuild'))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../build/frontBuild/index.html'))
  })
}

if (process.env.NODE_ENV === 'e2etest') {
  try {
    initTestRepo()
  } catch (e) {
    console.log(e);
  }

  /*
  const user: RegisterUserInput = {
    username: "testuser", 
    email: "testuser@testus.er", 
    password: "Testi123!"
  }
  User.registerAdmin(user).catch(e => console.log(e))
  */
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
