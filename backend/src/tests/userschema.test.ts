import { createTestClient } from 'apollo-server-testing'
import gql from 'graphql-tag'
import { server } from '../index'

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

describe('User schema mutations', () => {

  it('user can not authorize with GitHub without providing a code as parameter', async () => {
    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: AUTHORIZE_WITH_GH
    })
    
    const errorFound = res.errors?.some(error => error.message === 'Variable "$code" of required type "String!" was not provided.')
    expect(errorFound).toBeTruthy()
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