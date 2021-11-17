
import { Request } from 'express'
import {
  PostRequestContent,
  ServiceName,
  AccessTokenResponse,
  GetRequestContent,
  DeleteRequestContent
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

const parseAmandusToken = (authHeader: unknown): string => {
  if (!authHeader || !isString(authHeader) || !authHeader.startsWith('Bearer ')) {
    throw new Error('Incorrect or missing amandus token')
  }

  return authHeader.substring(7, authHeader.length)
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
  serviceToken: AccessTokenResponse
}

const parsePostRequest = (
  req: Request
): PostRequestContent => {
  const body = req.body as RequestBody

  const postRequestContent: PostRequestContent = {
    id: Number(req.params.id),
    serviceName: parseServiceName(req.params.service),
    amandusToken: parseAmandusToken(req.headers.authorization),
    serviceToken: parseServiceToken(body.serviceToken)
  }

  return postRequestContent
}

const parseGetRequest = (
  req: Request
): GetRequestContent => {

  const getRequestContent: GetRequestContent = {
    id: Number(req.params.id),
    serviceName: parseServiceName(req.params.service),
    amandusToken: parseAmandusToken(req.headers.authorization)
  }

  return getRequestContent
}

const parseDeleteRequest = (
  req: Request
): DeleteRequestContent => {

  const serviceName = req.params.service

  const deleteRequestContent: DeleteRequestContent = {
    id: Number(req.params.id),
    serviceName: serviceName ? parseServiceName(serviceName) : undefined,
    amandusToken: parseAmandusToken(req.headers.authorization)
  }

  return deleteRequestContent
}

export {
  parsePostRequest,
  parseGetRequest,
  parseDeleteRequest
}