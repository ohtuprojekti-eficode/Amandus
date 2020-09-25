import { makeExecutableSchema } from 'graphql-tools'

import user from './user'

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

export default rootSchema