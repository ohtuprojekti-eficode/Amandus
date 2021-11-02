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

describe('token service (credential store)', () => {
  beforeEach(() => tokenService.clearStorage())

  describe('with id', () => {
    it('should return null if empty', () => {
      const tokenMap = tokenService.getTokenMapById(1)

      expect(tokenMap).toBe(null)
    })

    it('should return token map if not empty', () => {
      const token = { access_token: 'ghtoken' }

      tokenService.setToken(1, 'github', token)

      const tokenMap = tokenService.getTokenMapById(1)

      expect(tokenMap).not.toBeNull()

      expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')
    })
  })

  describe('with amandus token', () => {
    const token = createAmandusToken()

    it('should return null if empty', () => {
      const tokenMap = tokenService.getTokenMap(token)

      expect(tokenMap).toBe(null)
    })

    it('should return token map if not empty', () => {
      const token1 = { access_token: 'ghtoken' }

      tokenService.setToken(1, 'github', token1)

      const tokenMap = tokenService.getTokenMap(token)

      expect(tokenMap).not.toBeNull()

      expect(tokenMap?.get('github')?.access_token).toBe('ghtoken')
    })
    /*
    it('should return tokens formatted for apollo context with getTokensForApolloContext', () => {
      const token1 = { access_token: 'ghtoken' }
      const token2 = { access_token: 'gitlabtoken' }
      const token3 = { access_token: 'bitbuckettoken' }

      tokenService.setToken(1, 'github', token1)
      tokenService.setToken(1, 'gitlab', token2)
      tokenService.setToken(1, 'bitbucket', token3)

      const contextTokens = tokenService.getTokensForApolloContext(token)

      expect(contextTokens).toEqual({
        githubToken: 'ghtoken',
        gitlabToken: 'gitlabtoken',
        bitbucketToken: 'bitbuckettoken',
      })
    })
    */
  })
})
