
import { Request } from 'express'
import { RequestParams, ServiceName } from '../types'

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String
}

const isServiceName = (name: unknown): name is ServiceName => {
  if (name === 'github' || name === 'bitbucket' || name === 'gitlab') {
    return true
  }

  return false
}

const parseToken = (token: unknown): string => {
  if (!token || !isString(token)) {
    throw new Error('Incorrect or missing amandus token')
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
  serviceToken: string
}

const toValidRequest = (
  req: Request
): RequestParams => {

  const body = req.body as RequestBody

  const validRequest: RequestParams = {
    amandusToken: parseToken(body.amandusToken),
    serviceName: parseServiceName(body.serviceName),
    serviceToken: parseToken(body.serviceToken)
  }

  return validRequest
}

export default toValidRequest