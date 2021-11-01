import tokens from '../../data/tokens'
import { IdTokenPair } from '../types'

const getTokens = (): IdTokenPair[] => {
  return tokens
}

const findById = (id: number): string | undefined => {
  const token = tokens.find(t => t.id === id)?.token

  return token
}

const addToken = (
  { id, token }: IdTokenPair
): IdTokenPair => {

  const newToken = {
    id: id,
    token: token
  }

  tokens.push(newToken)
  return newToken
}

const removeToken = (id: number) => {
  console.log(`removing token ${id}`)
  return null
}

export default {
  getTokens,
  addToken,
  findById,
  removeToken
}
