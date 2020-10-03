import { makeExecutableSchema } from 'graphql-tools'
import repository from './repository'
import user from './user'

const Query = `
    type Query {
        getUserById(id: String): String!
        cloneRepository(url: String): [File]
    },
`

const Mutation = `
    type Mutation {
        addUser(username: String) : String!
    }
`

const rootSchema = makeExecutableSchema({
  typeDefs: [Query, Mutation, user.typeDef, repository.typeDef],
  resolvers: [user.resolvers, repository.resolvers],
})

export default rootSchema
