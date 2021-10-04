import { ServiceUserType } from '../types/user'
import fetch from 'node-fetch'

export const getRepoList = (
  service: ServiceUserType,
  token: string
  ): Promise<any> => {
    const prefix = service.serviceName == 'github' ? 'token' : 'Bearer'
    const authHeader = `${prefix} ${token}`
    console.log(`USING header ${authHeader} AND url ${service.reposurl} FOR FETCHING`)

    return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `${prefix} ${token}`,
      },
    })
    .then((res) => {
      console.log('RECEIVED RESPONSE:')
      console.log(res)
      return res.json()
    })
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
