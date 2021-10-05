import { ServiceUserType } from '../types/user'
import { 
  GitHubRepoListResponse,
  BitbucketRepoListResponse,
  GitLabRepoListResponse,
} from '../types/repo'
import fetch from 'node-fetch'

export const getGitHubRepoList = (
  service: ServiceUserType,
  token: string
): Promise<GitHubRepoListResponse[]> => {

  return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then<GitHubRepoListResponse[]>((res) => res.json())
  .catch((error: Error) => {
    throw new Error(error.message)
  })
}

export const getBitbucketRepoList = (
  service: ServiceUserType,
  token: string
): Promise<BitbucketRepoListResponse> => {

  return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then<BitbucketRepoListResponse>((res) => res.json())
  .catch((error: Error) => {
    throw new Error(error.message)
  })
}

export const getGitLabRepoList = (
  service: ServiceUserType,
  token: string
): Promise<GitLabRepoListResponse[]> => {

  return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
  .then<GitLabRepoListResponse[]>((res) => res.json())
  .catch((error: Error) => {
    throw new Error(error.message)
  })
}