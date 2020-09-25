import config from '../utils/config'

import { ApolloServer } from 'apollo-server'
import schema from './schema/schema'

const server = new ApolloServer({
  schema: schema
})

interface Args {
  url: string
}

server.listen({ port: config.PORT }).then(( {url}:Args ) => {
  console.log(`Server running at ${url}`)
})

export default {
  server,
  schema,
  config
}