import { createToken } from './../utils/token'
import tokenService from '../services/token'

const createAmandusToken = () => {
  return createToken({ id: 1, username: 'testuser', email: 'test@email.com' })
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
