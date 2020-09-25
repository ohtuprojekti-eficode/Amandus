const config = require('../utils/config')

const { ApolloServer } = require('apollo-server')
const schema = require('./schema/schema')

const server = new ApolloServer({
  schema: schema
})

interface Args {
  url: string
}

server.listen({ port: config.PORT }).then(( {url}:Args ) => {
  console.log(`Server running at ${url}`)
})

module.exports = {
  server,
  schema,
  config
}