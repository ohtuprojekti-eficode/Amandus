import { makeExecutableSchema } from 'graphql-tools'
import repository from './repository'
import user from './user'

const Query = `
    type Query {
        githubLoginUrl: String!
        cloneRepository(url: String): [File]
    },
`

const Mutation = `
    type Mutation {
        logout: String
        authorizeWithGithub(code: String!) : User
        addUser(username: String) : String!
        saveChanges(file: FileInput, username: String, email: String, token: String): String
    }
`

const rootSchema = makeExecutableSchema({
  typeDefs: [Query, Mutation, user.typeDef, repository.typeDef],
  resolvers: [user.resolvers, repository.resolvers],
})

export default rootSchema
