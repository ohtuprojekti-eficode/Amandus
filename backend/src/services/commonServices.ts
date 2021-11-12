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
  console.log('FETCHING REPOS FROM')
  console.log(service.reposurl)
  console.log('WITH TOKEN')
  console.log(`Bearer ${token}`)

  return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
    .then<ServiceRepository[] | ServiceRepository>(res => {
      return res.json().then(data => {
        if (!res.ok) throw new Error(data.message)
        else return data
      })
    })
    .catch(e => {
      throw new Error((e as Error).message)
    })
}

export const requestServiceUser = async (
  service: string,
  code: string
): Promise<ServiceUserResponse> => {

  if (service === 'github') {
    return await requestGithubUser(code)
  }

  if (service === 'bitbucket') {
    return await requestBitbucketUser(code)
  }

  if (service === 'gitlab') {
    return await requestGitLabUser(code)
  }

  throw Error(`unable to fetch user of ${service}`)
}