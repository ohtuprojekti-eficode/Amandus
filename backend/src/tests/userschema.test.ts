import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
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
      token,
      user {
        id
        username
      }
    }
  }
`

// const LOGIN = gql`
//   mutation login($username: String!, $password: String!) {
//     register(username: $username, password: $password) {
//       token,
//       user {
//         id
//         username
//       }
//     }
//   }
// `

describe('User schema mutations', () => {

  beforeEach(async () => {
    
    await User.deleteAll()
  
		const userData = {
      username: 'testuser',
			email: 'testuser@test.com',
			password: 'testpassword'
		}
        
		await User.registerUser(userData)

  })
  
  it('user can register with valid username, email and password', async () => {
    
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        username: 'testuser2',
        email: 'testuser2@test.com',
        password: 'mypassword'
      }
    })
    
    
    console.log('result', res)
  })

  it('user can not authorize with an invalid GitHub code', async () => {
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: AUTHORIZE_WITH_GH,
      variables: { code: 'invalid' }
    })
    
    const errorFound = res.errors?.some(error => error.message === 'Invalid or expired GitHub code')
    expect(errorFound).toBeTruthy()
  })
})


describe('User schema queries', () => {
  
  it('no user data is returned when user is not logged in', async () => {
    const { query } = createTestClient(server)

    const res = await query({
      query: ME
    })
    
    expect(res.data?.me).toBeNull()
  })
})