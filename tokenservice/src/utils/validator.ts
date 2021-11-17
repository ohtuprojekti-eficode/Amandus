
import { Request } from 'express'
import {
  PostRequestContent,
  ServiceName,
  AccessTokenResponse,
  RequestContent,
  GetRequestContent,
  DeleteRequestContent,
  QueryType,
  RequestBody
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

const isQueryType = (query: unknown): query is QueryType => {
  if (query === 'state' || query === 'token') {
    return true
  }
  return false
}

const parseAmandusToken = (authHeader: unknown): string => {
  if (!authHeader || !isString(authHeader) || !authHeader.startsWith('Bearer ')) {
    throw new TypeError('incorrect or missing amandus token')
  }

  return authHeader.substring(7, authHeader.length)
}

const parseServiceToken = (token: unknown): AccessTokenResponse => {
  if (!token || !isAccessTokenResponse(token)) {
    throw new TypeError('incorrect or missing service token')
  }

  return token
}

const parseServiceName = (name: unknown): ServiceName => {
  if (!name || !isServiceName(name)) {
    throw new TypeError('incorrect or missing service name')
  }

  return name
}

const parseQueryType = (query: unknown): QueryType => {
  if (!query || !isQueryType(query)) {
    throw new TypeError('invalid data query string')
  }
  return query
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
    amandusToken: parseAmandusToken(req.headers.authorization),
    queryType: parseQueryType(req.query.data)
  }

  return getRequestContent
}

const parseDeleteTokenRequest = (
  req: Request
): DeleteRequestContent => {

  const serviceName = req.params.service

  const deleteRequestContent: DeleteRequestContent = {
    id: Number(req.params.id),
    serviceName: parseServiceName(serviceName),
    amandusToken: parseAmandusToken(req.headers.authorization)
  }

  return deleteRequestContent
}

const parseDeleteUserRequest = (
  req: Request
): RequestContent => {

  const deleteUserRequestContent: RequestContent = {
    id: Number(req.params.id),
    amandusToken: parseAmandusToken(req.headers.authorization)
  }

  return deleteUserRequestContent
}

export {
  parsePostRequest,
  parseGetRequest,
  parseDeleteTokenRequest,
  parseDeleteUserRequest
}