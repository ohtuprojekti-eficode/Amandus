import { AccessTokenResponse, ServiceName } from './../types/service'
import fetch from 'node-fetch'

import config from '../utils/config'

const tokenServiceUrl = config.TOKEN_SERVICE_URL

const getAccessToken = async (
  id: number,
  serviceName: ServiceName,
  amandusToken: string
): Promise<string> => {
  const tokenResponse = await fetch(`${tokenServiceUrl}/api/tokens/${id}/${serviceName}?data=token`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${amandusToken}` }
  })

  const { access_token } = await tokenResponse.json() as AccessTokenResponse

  return access_token
}

const setAccessToken = async (
  id: number,
  service: ServiceName,
  amandusToken: string,
  serviceToken: AccessTokenResponse
): Promise<void> => {
  const body = { serviceToken: serviceToken }

  const response = await fetch(`${tokenServiceUrl}/api/tokens/${id}/${service}?data=token`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${amandusToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  if (response.status !== 200) {
    throw new Error('something went wrong while adding new token')
  }
}

const deleteUser = async (
  id: number,
  amandusToken: string
): Promise<void> => {
  const response = await fetch(`${tokenServiceUrl}/api/tokens/${id}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${amandusToken}`,
        "Content-Type": "application/json"
      }
    })

  if (response.status !== 200) {
    throw new Error('Something went wrong while deleting user tokens from token service')
  }
}

const isServiceConnected = async (
  id: number,
  service: ServiceName,
  amandusToken: string
): Promise<boolean> => {
  const response = await fetch(`${tokenServiceUrl}/api/tokens/${id}/${service}?data=state`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${amandusToken}` }
  })

  if (!response.ok) {
    throw new Error('Error fetching service connection status')
  }

  // TODO: add checks for response format
  const { connected } = await response.json() as { connected: boolean }

  return connected

}

export default {
  getAccessToken,
  setAccessToken,
  deleteUser,
  isServiceConnected
}
