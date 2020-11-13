import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { closePool } from '../db/connect'
import { server } from '../index'
import User from '../model/user'

const AUTHORIZE_WITH_GH = gql`
  mutation authorizeWithGithub($code: String!) {
    authorizeWithGithub(code: $code) {
      user {
        id
        username
        emails
        gitHubId
        gitHubLogin
        gitHubEmail
        gitHubReposUrl
        gitHubToken
      }
      token
    }
  }
`

const ME = gql`
  query {
    me {
      id
      username
      emails
      gitHubId
      gitHubLogin
      gitHubEmail
      gitHubReposUrl
      gitHubToken
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
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: 'testuser2',
        email: 'testuser2@test.com',
        password: 'mypassword',
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.data?.register?.user?.username).toEqual('testuser2')
  })

  it('backend returns a token after user has successfully registered', async () => {
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: 'testuser2',
        email: 'testuser2@test.com',
        password: 'mypassword',
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.data?.register?.token).toBeTruthy()
  })

  it('user can not register without a username', async () => {
    const { mutate } = createTestClient(server)

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorFound).toBeTruthy()
  })

  it('user can not register without a password', async () => {
    const { mutate } = createTestClient(server)

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorFound).toBeTruthy()
  })

  it('user can not register without an email address', async () => {
    const { mutate } = createTestClient(server)

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    const { mutate } = createTestClient(server)

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
    const { mutate } = createTestClient(server)

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorFound).toBeTruthy()
  })

  it('user can not login without a valid password', async () => {
    const { mutate } = createTestClient(server)

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorFound).toBeTruthy()
  })

  it('user can not login without a valid username', async () => {
    const { mutate } = createTestClient(server)

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(errorFound).toBeTruthy()
  })

  it('user can not authorize with an invalid GitHub code', async () => {
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: AUTHORIZE_WITH_GH,
      variables: { code: 'invalid' },
    })

    const errorFound = res.errors?.some(
      (error) => error.message === 'Invalid or expired GitHub code'
    )
    expect(errorFound).toBeTruthy()
  })
})

describe('User schema GitHub auth mutations', () => {
  it('user can not authorize with an invalid GitHub code', async () => {
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: AUTHORIZE_WITH_GH,
      variables: { code: 'invalid' },
    })

    const errorFound = res.errors?.some(
      (error) => error.message === 'Invalid or expired GitHub code'
    )
    expect(errorFound).toBeTruthy()
  })
})

describe('User schema logged out queries', () => {
  it('no user data is returned when user is not logged in', async () => {
    const { query } = createTestClient(server)

    const res = await query({
      query: ME,
    })

    expect(res.data?.me).toBeNull()
  })
})

afterAll(async () => {
  await closePool()
})
