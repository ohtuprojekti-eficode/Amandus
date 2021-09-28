import { createTokens } from '../utils/tokens'
import tokenService from '../services/token'

const createAmandusToken = () => {
  return createTokens({ id: 1, username: 'testuser', user_role: 'non-admin', email: 'test@email.com' })
    .accessToken
}

describe('token service (credential store)', () => {
  beforeEach(() => tokenService.clearStorage())

  describe('with id', () => {
    it('should return null if empty', () => {
      const tokenMap = tokenService.getTokenMapById(1)

      expect(tokenMap).toBe(null)
    })

    it('should return token map if not empty', () => {
      tokenService.setToken(1, 'github', 'ghtoken')

      const tokenMap = tokenService.getTokenMapById(1)

      expect(tokenMap).not.toBeNull()

      expect(tokenMap?.get('github')).toBe('ghtoken')
    })

    it('should return tokens formatted for apollo context with getTokensForApolloContext', () => {
      tokenService.setToken(1, 'github', 'ghtoken')
      tokenService.setToken(1, 'gitlab', 'gitlabtoken')
      tokenService.setToken(1, 'bitbucket', 'bitbuckettoken')

      const contextTokens = tokenService.getTokensForApolloContextById(1)

      expect(contextTokens).toEqual({
        githubToken: 'ghtoken',
        gitlabToken: 'gitlabtoken',
        bitbucketToken: 'bitbuckettoken',
      })
    })
  })

  describe('with amandus token', () => {
    const token = createAmandusToken()

    it('should return null if empty', () => {
      const tokenMap = tokenService.getTokenMap(token)

      expect(tokenMap).toBe(null)
    })

    it('should return token map if not empty', () => {
      tokenService.setToken(1, 'github', 'ghtoken')

      const tokenMap = tokenService.getTokenMap(token)

      expect(tokenMap).not.toBeNull()

      expect(tokenMap?.get('github')).toBe('ghtoken')
    })

    it('should return tokens formatted for apollo context with getTokensForApolloContext', () => {
      tokenService.setToken(1, 'github', 'ghtoken')
      tokenService.setToken(1, 'gitlab', 'gitlabtoken')
      tokenService.setToken(1, 'bitbucket', 'bitbuckettoken')

      const contextTokens = tokenService.getTokensForApolloContext(token)

      expect(contextTokens).toEqual({
        githubToken: 'ghtoken',
        gitlabToken: 'gitlabtoken',
        bitbucketToken: 'bitbuckettoken',
      })
    })
  })
})
