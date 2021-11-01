import { IdTokenPair } from './types'

const isNumber = (id: unknown): id is number => {
  return typeof id === 'number' || id instanceof Number
}

const parseId = (id: unknown): number => {
  if (!id || !isNumber(id)) {
    throw new Error('Incorrect or missing id')
  }

  return id
}

const isString = (token: unknown): token is string => {
  return typeof token === 'string' || token instanceof String
}

const parseToken = (token: unknown): string => {
  if (!token || !isString(token)) {
    throw new Error('Incorrect or missing token')
  }
  return token
}

type Fields = { id: unknown, token: unknown }

const toNewToken = ({ id, token }: Fields): IdTokenPair => {

  const newToken: IdTokenPair = {
    id: parseId(id),
    token: parseToken(token)
  }

  return newToken
}

export default toNewToken