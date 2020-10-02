import { makeExecutableSchema } from 'graphql-tools'
import repository from './repository'
import user from './user'

const Query = `
    type Query {
        githubLoginUrl: String!
        cloneRepository(url: String): [File]
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
  typeDefs: [Query, Mutation, user.typeDef, repository.typeDef],
  resolvers: [user.resolvers, repository.resolvers],
})

export default rootSchema
