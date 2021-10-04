import { ServiceUserType } from '../types/user'
import { 
  GitHubRepoListResponse,
  BitbucketRepoListResponse,
  GitLabRepoListResponse,
} from '../types/repo'
import fetch from 'node-fetch'

export const getRepoList = (
  service: ServiceUserType,
  token: string
  ): Promise<GitHubRepoListResponse | BitbucketRepoListResponse | GitLabRepoListResponse> => {

    const prefix = service.serviceName == 'github' ? 'token' : 'Bearer'
    return fetch(`${service.reposurl}`, {
    headers: {
      Authorization: `${prefix} ${token}`,
      },
    })
    .then<GitHubRepoListResponse | BitbucketRepoListResponse | GitLabRepoListResponse>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
