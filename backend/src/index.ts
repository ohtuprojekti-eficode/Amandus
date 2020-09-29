import { PORT } from '../utils/config'

import { ApolloServer } from 'apollo-server'
import schema from './schema/schema'

const server = new ApolloServer({
  schema: schema,
})

void server.listen(PORT).then(({ url }) => {
  console.log(`Server running at ${url}`)
})
