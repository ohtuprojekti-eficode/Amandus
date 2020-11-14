import { makeExecutableSchema } from 'graphql-tools'
import repository from './repository'
import user from './user'

const Query = `
    type Query {
        githubLoginUrl: String!
        me: User
        getRepoState(url: String): RepoState!
        cloneRepository(url: String!): String
    },
`

const Mutation = `
    type AuthResponse {
        user: User
        token: String
    }
    type LocalUser {
        user_id: Int
        username: String
        email: String
    }
    input AddServiceArgs {
        serviceName: String!
        username: String!
        email: String!
        token: String!
        reposurl: String!
    }
    type GithubAccount {
        username: String
        email: String
    }
    type Mutation {
        logout: String
        register(
            username: String!
            email: String!
            password: String!
        ): AuthResponse
        login(
            username: String!
            password: String!
        ): AuthResponse
        saveChanges(
            file: FileInput! 
            branch: String!
            commitMessage: String
        ): String
        authorizeWithGithub(
            code: String!
        ): AuthResponse
        connectGitService(
            service: AddServiceArgs
        ): String
        switchBranch(
            url: String!
            branch: String!
        ): String
    }
`

const rootSchema = makeExecutableSchema({
  typeDefs: [Query, Mutation, user.typeDef, repository.typeDef],
  resolvers: [user.resolvers, repository.resolvers],
})

export default rootSchema
