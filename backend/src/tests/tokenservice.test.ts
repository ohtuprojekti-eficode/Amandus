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

describe('Token service', () => {
  const amandusToken = createAmandusToken()
  const gitHubToken = { access_token: 'gh_token' }
  const bitBucketToken = { access_token: 'bb_token' }

  beforeEach(async () => {
    // clear user from token service before every test
    try {
      await tokenService.deleteUser(1, amandusToken)
    } catch (e) {
      //ignore error received when attempting to remove non-existing user
    }
  })

  describe('setting new token', () => {
    it('succeeds with valid parameters', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)
    })

    it('fails with invalid amandus token', async () => {
      const setWithInvalidToken = async () => {
        await tokenService.setAccessToken(1, 'github', 'invalidToken', gitHubToken)
      }
      await expect(setWithInvalidToken()).rejects.toThrow()
    })

    it('fails with invalid id', async () => {
      const setWithInvalidId = async () => {
        await tokenService.setAccessToken(2, 'bitbucket', amandusToken, bitBucketToken)
      }

      await expect(setWithInvalidId()).rejects.toThrow()
    })

    it('if service token does not exist, nothing is returned', async () => {
      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBeNull()
    })

    it('new token can be set', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)
    })

  })

  describe('getting token', () => {
    it('succeeds with valid parameters', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBe(gitHubToken.access_token)
    })

    it('fails if token is not set', async () => {
      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBeNull()
    })

    it('fails with invalid amandus token', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const retrievedToken = await tokenService.getAccessToken(1, 'github', 'invalid_token')

      expect(retrievedToken).toBeNull()
    })

    it('fails with invalid id', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const retrievedToken = await tokenService.getAccessToken(2, 'github', amandusToken)

      expect(retrievedToken).toBeNull()
    })
  })

  describe('service connection status check', () => {
    it('returns true, if a service token exists', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const isConnected = await tokenService.isServiceConnected(1, 'github', amandusToken)
      expect(isConnected).toBe(true)
    })

    it('returns false, if service token does not exist', async () => {
      const isConnected = await tokenService.isServiceConnected(1, 'github', amandusToken)
      expect(isConnected).toBe(false)
    })

    it('fails with invalid amandus token', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const getWithInvalidToken = async () => {
        await tokenService.isServiceConnected(1, 'github', 'invalid_token')
      }

      await expect(getWithInvalidToken()).rejects.toThrow()
    })

    it('fails with invalid id', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const getWithInvalidToken = async () => {
        await tokenService.isServiceConnected(2, 'github', amandusToken)
      }

      await expect(getWithInvalidToken()).rejects.toThrow()
    })
  })

  describe('token deletation', () => {
    it('succeeds with valid parameters', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const removed = await tokenService.deleteToken(1, 'github', amandusToken)
      expect(removed).toBe(true)

      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBeNull()
    })

    it('fails if token does not exist', async () => {
      const deleteNonExistingToken = async () => {
        await tokenService.deleteToken(1, 'github', amandusToken)
      }

      await expect(deleteNonExistingToken()).rejects.toThrow()
    })

    it('fails with invalid amandus token', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const deleteWithInvalidToken = async () => {
        await tokenService.deleteToken(1, 'github', 'invalid_token')
      }

      await expect(deleteWithInvalidToken()).rejects.toThrow()

      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBe(gitHubToken.access_token)
    })

    it('fails with invalid id', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const deleteWithInvalidId = async () => {
        await tokenService.deleteToken(2, 'github', amandusToken)
      }

      await expect(deleteWithInvalidId()).rejects.toThrow()

      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBe(gitHubToken.access_token)
    })
  })

  describe('user deletation', () => {
    it('succeeds with valid parameters', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const removed = await tokenService.deleteUser(1, amandusToken)
      expect(removed).toBe(true)

      const retrievedToken = await tokenService.getAccessToken(1, 'github', amandusToken)
      expect(retrievedToken).toBeNull()
    })

    it('fails if user does not exist', async () => {
      const deleteUser = async () => {
        await tokenService.deleteUser(1, amandusToken)
      }

      await expect(deleteUser()).rejects.toThrow()

    })

    it('fails with invalid amandus token', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const deleteWithInvalidToken = async () => {
        await tokenService.deleteUser(1, 'invalid_token')
      }

      await expect(deleteWithInvalidToken()).rejects.toThrow()
    })

    it('fails with invalid id', async () => {
      const tokenIsSet = await tokenService.setAccessToken(1, 'github', amandusToken, gitHubToken)
      expect(tokenIsSet).toBe(true)

      const deleteWithInvalidToken = async () => {
        await tokenService.deleteUser(2, amandusToken)
      }

      await expect(deleteWithInvalidToken()).rejects.toThrow()
    })
  })
})