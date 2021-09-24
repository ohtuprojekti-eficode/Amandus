import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import jwt, { verify } from 'jsonwebtoken'
import cors from 'cors'
import { readFileSync } from 'fs'

import { createToken } from './utils/token'

import config from './utils/config'
import schema from './schema/schema'

//import { Req } from './types/request'
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
  context: async ({ req, res }) => {
    const accessToken: any = req && req.headers["x-access-token"]
    const refreshToken: any = req && req.headers["x-refresh-token"]

    if (!accessToken || !refreshToken) return

    try {
      // accessing with working access token
      const decodedAccessToken = <UserJWT>verify(accessToken, config.JWT_SECRET)


      if (!decodedAccessToken.id) return
      const currentUser = await User.getUserById(decodedAccessToken.id)
      const githubToken = decodedAccessToken.githubToken

      //const currentUser = await User.findById(decodedAccessToken.id)
      return { currentUser, githubToken }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        // trying to access with expired access token...
        try {
          const decodedRefreshToken = <UserJWT>verify(refreshToken, config.JWT_SECRET)
          if (!decodedRefreshToken.id) return

          const user = await User.getUserById(decodedRefreshToken.id)
          const userTokens = createToken(user);

          res.set({
            "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
            "x-access-token": userTokens.accessToken,
            "x-refresh-token": userTokens.refreshToken
          })
        } catch (e) {
          // invalid refresh token -> do nothing
          return
        }

      } else {
        throw e
      }
    }
    return
    //const auth = req && req.headers.authorization
    //if (auth && auth.toLowerCase().startsWith('bearer')) {
    //  const decodedToken = <UserJWT>verify(auth.substring(7), config.JWT_SECRET)
    //  const currentUser = await User.getUserById(decodedToken.id)
    //  const githubToken = decodedToken.githubToken
    //  return { currentUser, githubToken }
    //}
    //return
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
