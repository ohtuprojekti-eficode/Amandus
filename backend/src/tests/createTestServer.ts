import { Req } from '../types/request'
import schema from '../schema/schema'
import { UserJWT } from '../types/user'
import { ApolloServer } from 'apollo-server-express'
import { verify } from 'jsonwebtoken'
import User from '../model/user'
import config from '../utils/config'

export const createApolloTestServer = (token: string): ApolloServer => {
  return new ApolloServer({
    schema,
    context: async ({ req }: Req) => {
      const newReq = {
        ...req,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
      const auth = newReq && newReq.headers.authorization
      if (auth && auth.toLowerCase().startsWith('bearer')) {
        const decodedToken = <UserJWT>(
          verify(auth.substring(7), config.JWT_SECRET)
        )
        const currentUser = await User.getUserById(decodedToken.id)
        return { currentUser }
      }
      return
    },
  })
}
