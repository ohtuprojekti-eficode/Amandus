const { makeExecutableSchema } = require('graphql-tools')

const user = require('./user')

const Query = `
    type Query {
        getUserById(id: String): String!
    }
`

const Mutation = `
    type Mutation {
        addUser(username: String) : String!
    }
`

const rootSchema = makeExecutableSchema({
    typeDefs: [ Query, Mutation, user.typeDef ],
    resolvers: user.resolvers
})

module.exports = rootSchema