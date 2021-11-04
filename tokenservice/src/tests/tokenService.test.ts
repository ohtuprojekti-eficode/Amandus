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

      const callWithInvalidId = () => {
        tokenService
          .setToken(amandusToken, 'gitlab', serviceToken, invalidId)
      }
      expect(() => {
        callWithInvalidId()
      }).toThrowError('token and id mismatch')

    })

    it('should throw a mismatch error on getting access token', async () => {
      const callWithInvalidId = async () => {
        await tokenService
          .getAccessToken(amandusToken, 'github', invalidId)
      }

      await expect(callWithInvalidId())
        .rejects
        .toThrowError('token and id mismatch')

    })

    it('should throw a mismatch error on removing access token', () => {
      const callWithInvalidId = () => {
        tokenService
          .removeToken(amandusToken, 'github', invalidId)
      }

      expect(() => callWithInvalidId())
        .toThrowError('token and id mismatch')
    })

    it('should throw a mismatch error on removing user', () => {
      const callWithInvalidId = () => {
        tokenService
          .removeUser(amandusToken, invalidId)
      }

      expect(() => callWithInvalidId())
        .toThrowError('token and id mismatch')
    })

  })
})