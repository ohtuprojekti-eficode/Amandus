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

  describe('with amandus token and id', () => {
    const token = createAmandusToken()

    it('should return null if empty', () => {
      const tokenMap = tokenService.getTokenMap(token, 6)

      expect(tokenMap).toBe(null)
    })
  })
})