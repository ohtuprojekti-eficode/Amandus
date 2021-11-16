import { createTokens } from '../utils/tokens'
import tokenService from '../services/token'

const createAmandusToken = () => {
  return createTokens({
    id: 1,
    username: 'testuser',
    user_role: 'non-admin',
    email: 'test@email.com',
  }).accessToken
}

test('new token can be added', async () => {
  const amandusToken = createAmandusToken()
  const access_token = { access_token: 'gh_token' }

  const response = await tokenService.setAccessToken(1, 'github', amandusToken, access_token)
  expect(response).toBe(true)
})

test('invalid id throws error', async () => {
  const amandusToken = createAmandusToken()
  const access_token = { access_token: 'gh_token' }

  const invalidId = async () => {
    await tokenService.setAccessToken(2, 'github', amandusToken, access_token)
  }

  await expect(invalidId()).rejects.toThrow()

})

test('access token can be received', async () => {
  const amandusToken = createAmandusToken()
  const access_token = { access_token: 'gh_token' }

  await tokenService.setAccessToken(1, 'github', amandusToken, access_token)

  const receivedToken = await tokenService.getAccessToken(1, 'github', amandusToken)

  expect(receivedToken).toBe('gh_token')
})

test('if access token does not exists, nothing is returned', async () => {
  const amandusToken = createAmandusToken()

  const response = await tokenService.getAccessToken(1, 'bitbucket', amandusToken)

  expect(response).toBeNull()

})

// describe('token service (credential store)', () => {
//   beforeEach(() => tokenService.clearStorage())

//   describe('with id', () => {
//     it('should return null if empty', () => {
//       const tokenMap = tokenService.getTokenMapById(1)

//       expect(tokenMap).toBe(null)
//     })

//     it('should return token map if not empty', () => {
//       const token = { access_token: 'ghtoken' }

//       tokenService.setToken(1, 'github', token)

//       const tokenMap = tokenService.getTokenMapById(1)

//       expect(tokenMap).not.toBeNull()

//       expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')
//     })

//     it('token should be able to be removed', () => {
//       const token = { access_token: 'ghtoken' }
//       tokenService.setToken(1, 'github', token)

//       const tokenMap = tokenService.getTokenMapById(1)
//       expect(tokenMap).not.toBeNull()
//       expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')

//       tokenService.removeToken(1, 'github')
//       const tokenMapAfter = tokenService.getTokenMapById(1)
//       expect(tokenMapAfter?.get('github')?.access_token).toBe(undefined)
//     })

//     it('should contain tokens which are not removed', () => {
//       const token1 = { access_token: 'ghtoken' }
//       const token2 = { access_token: 'gltoken' }
//       const token3 = { access_token: 'bbtoken' }
//       tokenService.setToken(56, 'github', token1)
//       tokenService.setToken(56, 'gitlab', token2)
//       tokenService.setToken(56, 'bitbucket', token3)

//       const tokenMap = tokenService.getTokenMapById(56)
//       expect(tokenMap?.size).toBe(3)

//       tokenService.removeToken(56, 'github')
//       tokenService.removeToken(56, 'gitlab')

//       const tokenMapAfter = tokenService.getTokenMapById(56)
//       expect(tokenMapAfter?.get('github')?.access_token).toBe(undefined)
//       expect(tokenMapAfter?.get('gitlab')?.access_token).toBe(undefined)
//       expect(tokenMapAfter?.get('bitbucket')?.access_token).toBe('bbtoken')
//     })
//   })

//   describe('with amandus token', () => {
//     const token = createAmandusToken()

//     it('should return null if empty', () => {
//       const tokenMap = tokenService.getTokenMap(token)

//       expect(tokenMap).toBe(null)
//     })

//     it('should return token map if not empty', () => {
//       const token1 = { access_token: 'ghtoken' }

//       tokenService.setToken(1, 'github', token1)

//       const tokenMap = tokenService.getTokenMap(token)

//       expect(tokenMap).not.toBeNull()

//       expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')
//     })
//   })
// })

// describe('Access through service', () => {
//   beforeEach(() => tokenService.clearStorage())

//   describe('Storing access details', () => {
//     it('data without creation and expiration time should not have them', () => {
//       const data = { access_token: 'ghtoken' }

//       tokenService.setToken(1, 'github', data)

//       const details = tokenService.getServiceDetails(1, 'github')

//       expect(details).not.toBeNull()
//       expect(details?.access_token).toBe('ghtoken')
//       expect(details?.refresh_token).toBe(undefined)
//       expect(details?.created_at).toBe(undefined)
//       expect(details?.expires_in).toBe(undefined)
//     })

//     it('expiration time should be added if creation time exists', () => {
//       const data = {
//         access_token: 'gitlabtoken',
//         refresh_token: 'Qo5JZktS',
//         created_at: 12345,
//       }

//       tokenService.setToken(2, 'gitlab', data)

//       const details = tokenService.getServiceDetails(2, 'gitlab')

//       expect(details).not.toBeNull()
//       expect(details?.access_token).toBe('gitlabtoken')
//       expect(details?.refresh_token).toBe('Qo5JZktS')
//       expect(details?.created_at).toBe(12345)
//       expect(details?.expires_in).not.toBe(undefined)
//     })

//     it('creation time should be added if expiration time exists', () => {
//       const data = {
//         access_token: 'bitbuckettoken',
//         refresh_token: 'pUMc4BLh',
//         expires_in: 7200,
//       }

//       tokenService.setToken(3, 'bitbucket', data)

//       const details = tokenService.getServiceDetails(3, 'bitbucket')

//       expect(details).not.toBeNull()
//       expect(details?.access_token).toBe('bitbuckettoken')
//       expect(details?.refresh_token).toBe('pUMc4BLh')
//       expect(details?.created_at).not.toBe(undefined)
//       expect(details?.expires_in).toBe(7200)
//     })

//     it('if time data exists it should not be altered', () => {
//       const data = {
//         access_token: 'mysterytoken',
//         refresh_token: 'QYAg4Jdd',
//         created_at: 987654321,
//         expires_in: 8721,
//       }

//       tokenService.setToken(4, 'bitbucket', data)

//       const details = tokenService.getServiceDetails(4, 'bitbucket')

//       expect(details).not.toBeNull()
//       expect(details?.access_token).toBe('mysterytoken')
//       expect(details?.refresh_token).toBe('QYAg4Jdd')
//       expect(details?.created_at).toBe(987654321)
//       expect(details?.expires_in).toBe(8721)
//     })
//   })

//   describe('Retrieving access token', () => {
//     it('should not return any access token if none is set', async () => {
//       const details = await tokenService.getAccessTokenByServiceAndId(
//         1,
//         'github'
//       )

//       expect(details).toBeNull()
//     })

//     it('should not return access token from different service', async () => {
//       const data1 = {
//         access_token: 'token1',
//         refresh_token: 'QYAg4Jdd',
//         expires_in: 84000,
//       }
//       const data2 = {
//         access_token: 'token2',
//         refresh_token: 'QpUMc4BLh',
//         expires_in: 7200,
//       }

//       tokenService.setToken(3467, 'gitlab', data1)
//       tokenService.setToken(3467, 'bitbucket', data2)
//       const details = await tokenService.getAccessTokenByServiceAndId(
//         3467,
//         'github'
//       )

//       expect(details).toBeNull()
//     })

//     it('all tokens should be corresponding to their service', async () => {
//       const data1 = {
//         access_token: 'kjgS7c12N',
//         refresh_token: 'QYAg4Jdd',
//         expires_in: 84000,
//       }
//       const data2 = {
//         access_token: '28Ggc4iK',
//         refresh_token: 'QpUMc4BLh',
//         expires_in: 7200,
//       }
//       const data3 = {
//         access_token: 'SnB81Szpq',
//         refresh_token: 'QpUMc4BLh',
//         expires_in: 7200,
//       }

//       tokenService.setToken(8004, 'github', data1)
//       tokenService.setToken(8004, 'gitlab', data2)
//       tokenService.setToken(8004, 'bitbucket', data3)
//       const token1 = await tokenService.getAccessTokenByServiceAndId(
//         8004,
//         'github'
//       )
//       const token2 = await tokenService.getAccessTokenByServiceAndId(
//         8004,
//         'gitlab'
//       )
//       const token3 = await tokenService.getAccessTokenByServiceAndId(
//         8004,
//         'bitbucket'
//       )

//       expect(token1).toBe('kjgS7c12N')
//       expect(token2).toBe('28Ggc4iK')
//       expect(token3).toBe('SnB81Szpq')
//     })
//   })

//   describe('Deleting user', () => {
//     it('User tokens should be removed', async () => {
//       const details = await tokenService.getAccessTokenByServiceAndId(
//         1,
//         'github'
//       )

//       expect(details).toBeNull()
//     })
//   })
// })