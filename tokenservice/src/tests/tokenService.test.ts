import { createTokens } from '../utils/token'
import tokenService from '../services/tokenService'

const createAmandusToken = () => {
  const testUser = {
    id: 6,
    username: 'charizard',
    user_role: 'non-admin',
    email: 'charizard@viridian.jp'
  }

  return createTokens(testUser).accessToken
}

describe('token service (credential store)', () => {
  beforeEach(() => tokenService.clearStorage())

  describe('with valid amandus token and id', () => {
    const amandusToken = createAmandusToken()
    const id = 6

    it('should return null if empty', () => {
      const tokenMap = tokenService.getTokenMap(amandusToken, id)

      expect(tokenMap).toBe(null)
    })

    it('should return token map if not empty', () => {
      const serviceToken = { access_token: 'ghtoken' }
      tokenService.setToken(amandusToken, 'github', serviceToken, id)

      const tokenMap = tokenService.getTokenMap(amandusToken, id)
      expect(tokenMap).not.toBeNull()
      expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')
    })

    it('should not contain token that is removed', () => {
      const serviceToken = { access_token: 'ghtoken' }
      tokenService.setToken(amandusToken, 'github', serviceToken, id)

      const tokenMap = tokenService.getTokenMap(amandusToken, id)
      expect(tokenMap).not.toBeNull()
      expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')

      tokenService.removeToken(amandusToken, 'github', id)
      expect(tokenMap?.get('github')?.access_token).toBe(undefined)
    })

    it('should contain tokens that are not removed', () => {
      const token1 = { access_token: 'ghtoken' }
      const token2 = { access_token: 'gltoken' }
      const token3 = { access_token: 'bbtoken' }
      tokenService.setToken(amandusToken, 'github', token1, id)
      tokenService.setToken(amandusToken, 'gitlab', token2, id)
      tokenService.setToken(amandusToken, 'bitbucket', token3, id)

      const tokenMap = tokenService.getTokenMap(amandusToken, id)
      expect(tokenMap?.size).toBe(3)

      tokenService.removeToken(amandusToken, 'github', id)
      tokenService.removeToken(amandusToken, 'gitlab', id)

      expect(tokenMap?.size).toBe(1)
      expect(tokenMap?.get('github')?.access_token).toBe(undefined)
      expect(tokenMap?.get('gitlab')?.access_token).toBe(undefined)
      expect(tokenMap?.get('bitbucket')?.access_token).toBe('bbtoken')
    })

    it('should return corresponding access token', async () => {
      const token1 = { access_token: 'ghtoken' }
      const token2 = { access_token: 'gltoken' }
      const token3 = { access_token: 'bbtoken' }
      tokenService.setToken(amandusToken, 'github', token1, id)
      tokenService.setToken(amandusToken, 'gitlab', token2, id)
      tokenService.setToken(amandusToken, 'bitbucket', token3, id)

      const response = await tokenService.getAccessToken(amandusToken, 'gitlab', id)
      expect(response).toBe('gltoken')
    })
  })

  describe('with valid amandus token and invalid id', () => {
    const amandusToken = createAmandusToken()
    const validId = 6
    const invalidId = 5

    beforeEach(() => {
      const serviceToken = { access_token: 'ghtoken' }
      tokenService.setToken(amandusToken, 'github', serviceToken, validId)
    })

    it('should throw a mismatch error on adding new token', () => {
      const serviceToken = { access_token: 'gltoken' }

      const setWithInvalidId = () => {
        tokenService
          .setToken(amandusToken, 'gitlab', serviceToken, invalidId)
      }
      expect(() => {
        setWithInvalidId()
      }).toThrowError('token and id mismatch')

    })

    it('should throw a mismatch error on getting access token', async () => {
      const getWithInvalidId = async () => {
        await tokenService
          .getAccessToken(amandusToken, 'github', invalidId)
      }

      await expect(getWithInvalidId())
        .rejects
        .toThrowError('token and id mismatch')

    })

    it('should throw a mismatch error on removing access token', () => {
      const removeTokenWithInvalidId = () => {
        tokenService
          .removeToken(amandusToken, 'github', invalidId)
      }

      expect(() => removeTokenWithInvalidId())
        .toThrowError('token and id mismatch')
    })

    it('should throw a mismatch error on removing user', () => {
      const removeUserWithInvalidId = () => {
        tokenService
          .removeUser(amandusToken, invalidId)
      }

      expect(() => removeUserWithInvalidId())
        .toThrowError('token and id mismatch')
    })

  })

  describe('with invalid amandus token', () => {
    const invalidAmandusToken = 'invalid_token'
    const validAmandusToken = createAmandusToken()
    const serviceToken = { access_token: 'ghtoken' }

    beforeEach(() => {
      tokenService.setToken(validAmandusToken, 'github', serviceToken, 6)
    })

    it('should throw a jwt error on adding new service token', () => {
      const setWithInvalidAmandusToken = () => {
        tokenService
          .setToken(invalidAmandusToken, 'gitlab', { access_token: 'gltoken' }, 6)
      }

      expect(() => setWithInvalidAmandusToken())
        .toThrowError('jwt malformed')
    })

    it('should throw a jwt error on getting a service token', async () => {
      const getWithInvalidAmandusToken = async () => {
        await tokenService
          .getAccessToken(invalidAmandusToken, 'github', 6)
      }

      await expect(() => getWithInvalidAmandusToken())
        .rejects
        .toThrowError('jwt malformed')
    })

    it('should throw a jwt error on removing a service token', () => {
      const removeTokenWithInvalidAmandusToken = () => {
        tokenService
          .removeToken(invalidAmandusToken, 'github', 6)
      }

      expect(() => removeTokenWithInvalidAmandusToken())
        .toThrowError('jwt malformed')
    })

    it('should throw a jwt error on removing user', () => {
      const removeUserWithInvalidAmandusToken = () => {
        tokenService.removeUser(invalidAmandusToken, 6)
      }

      expect(() => removeUserWithInvalidAmandusToken())
        .toThrowError('jwt malformed')
    })
  })
})

describe('Access through service', () => {
  beforeEach(() => tokenService.clearStorage())
  const amandusToken = createAmandusToken()

  describe('Storing access details', () => {
    it('data without creation and expiration time should not have them', () => {
      const amandusToken = createAmandusToken()
      const serviceToken = { access_token: 'ghtoken' }

      tokenService.setToken(amandusToken, 'github', serviceToken, 6)

      const details = tokenService.getServiceDetails(amandusToken, 'github', 6)

      expect(details).not.toBeNull()
      expect(details?.access_token).toBe('ghtoken')
      expect(details?.refresh_token).toBe(undefined)
      expect(details?.created_at).toBe(undefined)
      expect(details?.expires_in).toBe(undefined)
    })

    it('expiration time should be added if creation time exists', () => {
      const data = {
        access_token: 'gitlabtoken',
        refresh_token: 'Qo5JZktS',
        created_at: 12345,
      }

      tokenService.setToken(amandusToken, 'gitlab', data, 6)

      const details = tokenService.getServiceDetails(amandusToken, 'gitlab', 6)

      expect(details).not.toBeNull()
      expect(details?.access_token).toBe('gitlabtoken')
      expect(details?.refresh_token).toBe('Qo5JZktS')
      expect(details?.created_at).toBe(12345)
      expect(details?.expires_in).not.toBe(undefined)
    })

    it('creation time should be added if expiration time exists', () => {
      const data = {
        access_token: 'bitbuckettoken',
        refresh_token: 'pUMc4BLh',
        expires_in: 7200,
      }

      tokenService.setToken(amandusToken, 'bitbucket', data, 6)

      const details = tokenService.getServiceDetails(amandusToken, 'bitbucket', 6)

      expect(details).not.toBeNull()
      expect(details?.access_token).toBe('bitbuckettoken')
      expect(details?.refresh_token).toBe('pUMc4BLh')
      expect(details?.created_at).not.toBe(undefined)
      expect(details?.expires_in).toBe(7200)
    })

    it('if time data exists it should not be altered', () => {
      const data = {
        access_token: 'mysterytoken',
        refresh_token: 'QYAg4Jdd',
        created_at: 987654321,
        expires_in: 8721,
      }

      tokenService.setToken(amandusToken, 'bitbucket', data, 6)

      const details = tokenService.getServiceDetails(amandusToken, 'bitbucket', 6)

      expect(details).not.toBeNull()
      expect(details?.access_token).toBe('mysterytoken')
      expect(details?.refresh_token).toBe('QYAg4Jdd')
      expect(details?.created_at).toBe(987654321)
      expect(details?.expires_in).toBe(8721)
    })
  })

  describe('Retrieving access token', () => {
    it('should not return any access token if none is set', async () => {
      const details = await tokenService.getAccessToken(
        amandusToken,
        'github',
        6
      )

      expect(details).toBeNull()
    })

    it('should not return access token from different service', async () => {
      const data1 = {
        access_token: 'token1',
        refresh_token: 'QYAg4Jdd',
        expires_in: 84000,
      }
      const data2 = {
        access_token: 'token2',
        refresh_token: 'QpUMc4BLh',
        expires_in: 7200,
      }

      tokenService.setToken(amandusToken, 'gitlab', data1, 6)
      tokenService.setToken(amandusToken, 'bitbucket', data2, 6)
      const details = await tokenService.getAccessToken(
        amandusToken,
        'github',
        6
      )

      expect(details).toBeNull()
    })

    it('all tokens should be corresponding to their service', async () => {
      const data1 = {
        access_token: 'kjgS7c12N',
        refresh_token: 'QYAg4Jdd',
        expires_in: 84000,
      }
      const data2 = {
        access_token: '28Ggc4iK',
        refresh_token: 'QpUMc4BLh',
        expires_in: 7200,
      }
      const data3 = {
        access_token: 'SnB81Szpq',
        refresh_token: 'QpUMc4BLh',
        expires_in: 7200,
      }

      tokenService.setToken(amandusToken, 'github', data1, 6)
      tokenService.setToken(amandusToken, 'gitlab', data2, 6)
      tokenService.setToken(amandusToken, 'bitbucket', data3, 6)
      const token1 = await tokenService.getAccessToken(
        amandusToken,
        'github',
        6
      )
      const token2 = await tokenService.getAccessToken(
        amandusToken,
        'gitlab',
        6
      )
      const token3 = await tokenService.getAccessToken(
        amandusToken,
        'bitbucket',
        6
      )

      expect(token1).toBe('kjgS7c12N')
      expect(token2).toBe('28Ggc4iK')
      expect(token3).toBe('SnB81Szpq')
    })
  })

  describe('Deleting user', () => {
    it('User tokens should be removed', async () => {
      const details = await tokenService.getAccessToken(
        amandusToken,
        'github',
        6
      )

      expect(details).toBeNull()
    })
  })
})