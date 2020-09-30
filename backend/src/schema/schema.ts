import { makeExecutableSchema } from 'graphql-tools'

import user from './user'

const Query = `
    type Query {
        getUserById(id: String): String!
    }
`

const Mutation = `
    type Mutation {
        logout: String
        loginGitHub(email: String, password: String) : User
        addUser(username: String) : String!
    }
`

const rootSchema = makeExecutableSchema({
  typeDefs: [Query, Mutation, user.typeDef],
  resolvers: user.resolvers,
})

export default rootSchema
