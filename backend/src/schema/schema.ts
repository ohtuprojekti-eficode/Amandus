import { makeExecutableSchema } from 'graphql-tools'
import repository from './repository'
import user from './user'

const Query = `
    type Query {
        githubLoginUrl: String!
        me: User
        cloneRepository(url: String): [File]
    },
`

const Mutation = `
    type AuthResponse {
        user: User
        token: String
    }
    type Mutation {
        logout: String
        saveChanges(
            file: FileInput! 
            branch: String!
        ): String
        authorizeWithGithub(
            code: String!
        ): AuthResponse
    }
`

const rootSchema = makeExecutableSchema({
  typeDefs: [Query, Mutation, user.typeDef, repository.typeDef],
  resolvers: [user.resolvers, repository.resolvers],
})

export default rootSchema
