import { ServiceUser, ServiceUserResponse } from '../types/service'
import { ServiceRepository } from '../types/repository'
import fetch from 'node-fetch'
import { requestGithubUser } from './gitHub'
import { requestBitbucketUser } from './bitbucket'
import { requestGitLabUser } from './gitLab'

export const getRepoList = (
  service: ServiceUser,
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

export const requestServiceUser = async (
  service: string,
  code: string
): Promise<ServiceUserResponse> => {

  if(service === 'github'){
    return await requestGithubUser(code)
  }

  if(service === 'bitbucket'){
    return await requestBitbucketUser(code)
  }

  if(service === 'gitlab'){
    return await requestGitLabUser(code)
  }

  throw Error(`unable to fetch user of ${service}`)
}