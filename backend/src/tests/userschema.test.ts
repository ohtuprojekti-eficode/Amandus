/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { createTestClient as createNormalTestClient } from 'apollo-server-testing'
import { createTestClient as createIntegrationTestClient } from 'apollo-server-integration-testing'
import gql from 'graphql-tag'
import { closePool } from '../db/connect'
import { server } from '../index'
import User from '../model/user'
import { createTokens } from '../utils/tokens'
import { v4 as uuid } from 'uuid'
import tokenService from '../services/token'

const ADD_SERVICE = gql`
  mutation connectGitService($service: AddServiceArgs!) {
    connectGitService(service: $service)
  }
`

const ME = gql`
  query {
    me {
      id
      username
      email
      services {
        serviceName
        username
        email
        reposurl
      }
    }
  }
`

const GH_TOKEN = gql`
  query {
    currentToken
  }
`

const IS_GH_CONNECTED = gql`
  query {
    isGithubConnected
  }
`

const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
    }
  }
`

describe('User schema register mutations', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })

  it('user can register with valid username, email and password', async () => {
    const { mutate } = createIntegrationTestClient({ apolloServer: server })

    const mutationResult = await mutate(REGISTER, {
      variables: {
        username: 'testuser2',
        email: 'testuser2@test.com',
        password: 'mypAssword?45',
      },
    })

    const expectedUser = await User.findUserByUsername('testuser2')
    const expectedTokens = createTokens(expectedUser)

    expect(mutationResult).toEqual({
      data: {
        register: expectedTokens,
      },
    })
  })

  it('backend returns a token after user has successfully registered', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: 'testuser2',
        email: 'testuser2@test.com',
        password: 'mypAssword?45',
      },
    })

    expect(res.data?.register).toBeTruthy()
  })

  it('user can not register without a username', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: '',
        email: 'testuser2@test.com',
        password: 'mypAssword?45',
      },
    })

    const errorFound = res.errors?.some(
      (error) =>
        error.message === 'Username, email or password can not be empty'
    )
    expect(errorFound).toBeTruthy()
  })

  it('user can not register without a password', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: 'testuser2',
        email: 'testuser2@test.com',
        password: '',
      },
    })

    const errorFound = res.errors?.some(
      (error) =>
        error.message === 'Username, email or password can not be empty'
    )

    expect(errorFound).toBeTruthy()
  })

  it('user can not register without an email address', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: 'testuser2',
        email: '',
        password: 'mypassword',
      },
    })

    const errorFound = res.errors?.some(
      (error) =>
        error.message === 'Username, email or password can not be empty'
    )
    expect(errorFound).toBeTruthy()
  })
})

describe('User schema login mutations', () => {
  beforeEach(async () => {
    await User.deleteAll()

    const userData = {
      username: 'testuser',
      email: 'testuser@test.com',
      password: 'mypAssword?45',
    }

    await User.registerUser(userData)
  })

  it('user can login with valid username and password', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        username: 'testuser',
        password: 'mypAssword?45',
      },
    })

    const expectedUser = await User.findUserByUsername('testuser')
    const expectedToken = createTokens(expectedUser)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.data).toEqual({
      login: expectedToken,
    })
  })

  it('user can not login without username and password', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        username: '',
        password: '',
      },
    })

    const errorFound = res.errors?.some(
      (error) => error.message === 'Invalid username or password'
    )
    expect(errorFound).toBeTruthy()
  })

  it('user can not login without a valid password', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        username: 'testuser',
        password: 'wrongpass',
      },
    })

    const errorFound = res.errors?.some(
      (error) => error.message === 'Invalid username or password'
    )
    expect(errorFound).toBeTruthy()
  })

  it('user can not login without a valid username', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        username: 'wronguser',
        password: 'mypAssword?45',
      },
    })

    const errorFound = res.errors?.some(
      (error) => error.message === 'Invalid username or password'
    )
    expect(errorFound).toBeTruthy()
  })
})

describe('User schema add git service mutations', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })

  it('users github account can be added to user data', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)

    const tokens = createTokens(user)

    const { mutate } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    const serviceArgs = {
      serviceName: 'github',
      username: 'github_username',
      email: 'user@githubmail.com',
      reposurl: 'mygithubrepos.github.com',
    }

    const mutationResult = await mutate(ADD_SERVICE, {
      variables: { service: serviceArgs },
    })

    expect(mutationResult).toEqual({
      data: {
        connectGitService: 'success',
      },
    })
  })

  it('users GitLab account can be added to user data', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)

    const tokens = createTokens(user)

    const { mutate } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    const serviceArgs = {
      serviceName: 'gitlab',
      username: 'gitlab_username',
      email: 'user@gitlabmail.com',
      reposurl: 'gitlab.com/users/1234/projects',
    }

    const mutationResult = await mutate(ADD_SERVICE, {
      variables: { service: serviceArgs },
    })

    expect(mutationResult).toEqual({
      data: {
        connectGitService: 'success',
      },
    })
  })

  it('users Bitbucket account can be added to user data', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)

    const tokens = createTokens(user)

    const { mutate } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    const serviceArgs = {
      serviceName: 'bitbucket',
      username: 'bitbucket_username',
      email: 'user@bitbucketmail.com',
      reposurl: 'bitbucket.com/user/repos'
    }

    const mutationResult = await mutate(ADD_SERVICE, {
      variables: { service: serviceArgs }
    })

    expect(mutationResult).toEqual({
      data: {
        connectGitService: 'success'
      }
    })
  })
})

describe('Context currentuser query', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })

  it('no user data is returned when user is not logged in', async () => {
    const { query } = createIntegrationTestClient({ apolloServer: server })

    const queryResult = await query(ME)

    expect(queryResult).toEqual({
      data: {
        me: null,
      },
    })
  })

  it('user data and github token is returned when set, no services', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)
    const tokens = createTokens(user)

    const { query } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    const queryResult = await query(ME)

    expect(queryResult).toEqual({
      data: {
        me: {
          id: user.id,
          username: userToSave.username,
          email: userToSave.email,
          services: null,
        },
      },
    })
  })

  it('user data and github token is returned when set, one service', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)
    const serviceArgs = {
      serviceName: 'github',
      username: 'github_username',
      email: 'user@githubmail.com',
      reposurl: 'mygithubrepos.github.com',
    }

    const tokens = createTokens(user)

    const { query, mutate } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    await mutate(ADD_SERVICE, {
      variables: { service: serviceArgs },
    })

    const queryResult = await query(ME)

    expect(queryResult).toEqual({
      data: {
        me: {
          id: user.id,
          username: userToSave.username,
          email: userToSave.email,
          services: [serviceArgs],
        },
      },
    })
  })
})

describe('Context githubToken query', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })

  it('no token is returned when set', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)

    const tokens = createTokens(user)

    const { query } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    const queryResult = await query(GH_TOKEN)

    expect(queryResult).toEqual({
      data: {
        currentToken: null,
      },
    })
  })

  it('correct token is returned when set', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)

    tokenService.setToken(user.id, 'github', 'githubtoken123')

    const tokens = createTokens(user)

    const { query } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': tokens.accessToken,
          'x-refresh-token': tokens.refreshToken,
        },
      },
    })

    const queryResult = await query(GH_TOKEN)

    expect(queryResult).toEqual({
      data: {
        currentToken: 'githubtoken123',
      },
    })
  })
})

describe('isGithubConnected', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })

  it('returns true if githubToken is in user context', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)
    const frontendJWTs = createTokens(user)
    tokenService.setToken(user.id, 'github', uuid())

    const { query } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': frontendJWTs.accessToken,
          'x-refresh-token': frontendJWTs.refreshToken,
        },
      },
    })

    const queryResult = await query(IS_GH_CONNECTED)

    expect(queryResult).toEqual({
      data: {
        isGithubConnected: true,
      },
    })
  })

  it('returns false if githubToken is not in user context', async () => {
    const userToSave = {
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)
    const frontendJWTs = createTokens(user)

    const { query } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          'x-access-token': frontendJWTs.accessToken,
          'x-refresh-token': frontendJWTs.refreshToken,
        },
      },
    })

    const queryResult = await query(IS_GH_CONNECTED)

    expect(queryResult).toEqual({
      data: {
        isGithubConnected: false,
      },
    })
  })
})
afterAll(async () => {
  await closePool()
})
