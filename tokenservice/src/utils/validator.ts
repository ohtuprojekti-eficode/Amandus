
import { Request } from 'express'
import {
  PostRequestContent,
  RequestContent,
  ServiceName,
  AccessTokenResponse
} from '../types'

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String
}

const isServiceName = (name: unknown): name is ServiceName => {
  if (name === 'github' || name === 'bitbucket' || name === 'gitlab') {
    return true
  }

  return false
}

const isAccessTokenResponse = (token: unknown): token is AccessTokenResponse => {
  const attempt = token as AccessTokenResponse
  if (!attempt.access_token || !isString(attempt.access_token)) {
    return false
  }

  return true
}

const parseAmandusToken = (token: unknown): string => {
  if (!token || !isString(token)) {
    throw new Error('Incorrect or missing amandus token')
  }

  return token
}

const parseServiceToken = (token: unknown): AccessTokenResponse => {
  if (!token || !isAccessTokenResponse(token)) {
    throw new Error('Incorrect or missing service token')
  }

  return token
}

const parseServiceName = (name: unknown): ServiceName => {
  if (!name || !isServiceName(name)) {
    throw new Error('Incorrect or missing service name')
  }

  return name
}

type RequestBody = {
  amandusToken: string,
  serviceName?: ServiceName,
  serviceToken?: AccessTokenResponse
}

const toValidPostRequest = (
  req: Request
): PostRequestContent => {

  const body = req.body as RequestBody

  const validRequest: PostRequestContent = {
    amandusToken: parseAmandusToken(body.amandusToken),
    serviceName: parseServiceName(body.serviceName),
    serviceToken: parseServiceToken(body.serviceToken)
  }

  return validRequest
}

const toValidRequest = (
  req: Request
): RequestContent => {

  const body = req.body as RequestBody

  const validRequest: RequestContent = {
    amandusToken: parseAmandusToken(body.amandusToken),
    serviceName: parseServiceName(body.serviceName)
  }

  return validRequest
}

const toAmandusToken = (
  req: Request
): string => {
  const body = req.body as RequestBody
  const amandusToken: string = parseAmandusToken(body.amandusToken)
  return amandusToken
}

export {
  toValidPostRequest,
  toValidRequest,
  toAmandusToken
}