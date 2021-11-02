
import { Request } from 'express'
import {
  PostRequestParams,
  GetRequestParams,
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
  serviceName: ServiceName,
  serviceToken?: AccessTokenResponse
}

const toValidPostRequest = (
  req: Request
): PostRequestParams => {

  const body = req.body as RequestBody

  const validRequest: PostRequestParams = {
    amandusToken: parseAmandusToken(body.amandusToken),
    serviceName: parseServiceName(body.serviceName),
    serviceToken: parseServiceToken(body.serviceToken)
  }

  return validRequest
}

const toValidGetRequest = (
  req: Request
): GetRequestParams => {

  const body = req.body as RequestBody

  const validRequest: GetRequestParams = {
    amandusToken: parseAmandusToken(body.amandusToken),
    serviceName: parseServiceName(body.serviceName)
  }

  return validRequest
}

export {
  toValidPostRequest,
  toValidGetRequest
}