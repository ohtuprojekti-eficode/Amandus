import { ServiceUser, ServiceUserResponse } from '../types/service'
import { ServiceRepository } from '../types/repository'
import { requestGithubUser } from './gitHub'
import { requestBitbucketUser } from './bitbucket'
import { requestGitLabUser } from './gitLab'

import { default as nodeFetch } from 'node-fetch'
import nodeFetchMock from '../tests/mocks/fetch'

// in case of running e2e tests, use mocked fetch:
const fetch = process.env.NODE_ENV === 'e2etest'
  ? nodeFetchMock
  : nodeFetch

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
    return await requestGithubUser(code, fetch)
  }

  if(service === 'bitbucket'){
    return await requestBitbucketUser(code, fetch)
  }

  if(service === 'gitlab'){
    return await requestGitLabUser(code, fetch)
  }

  throw Error(`unable to fetch user of ${service}`)
}