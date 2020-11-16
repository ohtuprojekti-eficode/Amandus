/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */

import { createTestClient as createNormalTestClient } from 'apollo-server-testing'
import { createTestClient as createIntegrationTestClient } from 'apollo-server-integration-testing'
import gql from 'graphql-tag'
import { closePool } from '../db/connect'
import { server } from '../index'
import User from '../model/user'
import config from '../utils/config'
import { sign } from 'jsonwebtoken'

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
    }
  }
`

const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
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
        password: 'mypassword',
      },
    })

    const expectedUser = await User.findUserByUsername('testuser2')
    const expectedToken = sign(
      {
        id: expectedUser?.id,
        username: expectedUser?.username,
      },
      config.JWT_SECRET
    )

    expect(mutationResult).toEqual({
      data: {
        register: {
          token: expectedToken,
          user: {
            id: expectedUser?.id,
            username: expectedUser?.username,
          },
        },
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
        password: 'mypassword',
      },
    })

    expect(res.data?.register?.token).toBeTruthy()
  })

  it('user can not register without a username', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: '',
        email: 'testuser2@test.com',
        password: 'mypassword',
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
      password: 'testpassword',
    }

    await User.registerUser(userData)
  })

  it('user can login with valid username and password', async () => {
    const { mutate } = createNormalTestClient(server)

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        username: 'testuser',
        password: 'testpassword',
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.data?.login?.user?.username).toEqual('testuser')
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
        password: 'testpassword',
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
      password: 'testpassword',
      email: 'test@test.fi',
    }

    const user = await User.registerUser(userToSave)

    //TODO oma funktio createUserJWT(user: UserType, secret: string)
    const token = sign(
      {
        id: user.id,
        username: user.username,
      },
      config.JWT_SECRET
    )

    const { mutate } = createIntegrationTestClient({
      apolloServer: server,
      extendMockRequest: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    })

    const serviceArgs = {
      serviceName: 'github',
      username: 'github_username',
      email: 'user@githubmail.com',
      token: 'token123',
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
})

describe('Context currentuser query', () => {
  it('no user data is returned when user is not logged in', async () => {
    const { query } = createIntegrationTestClient({ apolloServer: server })

    const queryResult = await query(ME)

    expect(queryResult).toEqual({
      data: {
        me: null,
      },
    })
  })
})

afterAll(async () => {
  await closePool()
})
