import { ServiceUserType } from '../types/service'
import { ServiceRepository } from '../types/repository'
import fetch from 'node-fetch'

export const getRepoList = (
  service: ServiceUserType,
  token: string
): Promise<ServiceRepository[] | ServiceRepository> => {
  return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
    .then<ServiceRepository[] | ServiceRepository>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}