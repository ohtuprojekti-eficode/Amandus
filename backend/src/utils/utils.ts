/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync } from 'fs'
import { File } from '../types/file'
import { sanitizeCommitMessage } from './sanitize'

import { ServiceName, ServiceTokenType } from '../types/service'
import { AppContext } from '../types/user'

import { Repo, GitHubRepoListResponse, BitbucketRepoListResponse, GitLabRepoListResponse } from '../types/repo'

const execProm = promisify(exec)

export const validateBranchName = async (branchName: string): Promise<void> => {
  await runShellCommand(`git check-ref-format --branch ${branchName}`)
}

const runShellCommand = async (command: string): Promise<string> => {
  try {
    return (await execProm(command)).stdout
  } catch (error) {
    throw new Error(error.message)
  }
}

export const pipe = <T>(...fns: Array<(a: T) => T>) => (x: T): T =>
  fns.reduce((value, func) => func(value), x)

export const getRepositoryFromFilePath = (file: File): string => {
  return file.name.split('/').slice(2, 4).join('/')
}

export const getServiceFromFilePath = (file: File): ServiceName => {
  return file.name.split('/')[1] as ServiceName
}

export const getFileNameFromFilePath = (
  file: File,
  repositoryName: string
): string => {
  return file.name.split(`${repositoryName}/`)[1] || file.name
}

interface ServiceProps {
  service: ServiceName
  appContext: AppContext
}

export const getServiceTokenFromAppContext = ({ service, appContext }: ServiceProps): ServiceTokenType | undefined => {
  let tokenToReturn: ServiceTokenType | undefined
  switch (service) {
    case 'gitlab':
      tokenToReturn = appContext.gitlabToken as ServiceTokenType
      break
    case 'bitbucket':
      tokenToReturn = appContext.bitbucketToken as ServiceTokenType
      break
    default: tokenToReturn = appContext.githubToken as ServiceTokenType
  }
  return tokenToReturn
}

export const writeToFile = (file: File): void => {
  writeFileSync(`./repositories/${file.name}`, file.content)
}

export const makeCommitMessage = (
  rawCommitMessage: string,
  username: string,
  realFilename: string
): string => {
  return rawCommitMessage
    ? sanitizeCommitMessage(rawCommitMessage)
    : `User ${username} modified file ${realFilename}`
}

export const getRepoLocationFromUrlString = (
  urlString: string,
  username: string
): string => {
  const url = new URL(urlString)
  const service = getServiceNameFromUrlString(urlString) || 'other'
  const repositoryName =
    url.pathname.endsWith('.git')
      ? url.pathname.slice(0, -4)
      : url.pathname

  const repoLocation = `./repositories/${username}/${service}${repositoryName}`
  return repoLocation
}

export const getRepoLocationFromRepoName = (
  repositoryName: string,
  username: string,
  service: ServiceName
): string => {
  const repoLocation = `./repositories/${username}/${service}/${repositoryName}`
  return repoLocation
}

export const getServiceNameFromUrlString = (urlString: string): ServiceName | undefined => {
  if (urlString.includes('github')) return 'github'
  if (urlString.includes('gitlab')) return 'gitlab'
  if (urlString.includes('bitbucket')) return 'bitbucket'
  return undefined
}

export const getServiceTokenFromContext = (serviceName: string, context: AppContext): string | undefined => {
  switch (serviceName) {
    case 'github': return context.githubToken;
    case 'bitbucket': return context.bitbucketToken;
    case 'gitlab': return context.gitlabToken;
    default: return undefined;
  }
}

export const parseGithubRepositories = (response: GitHubRepoListResponse[]): Repo[] => {
  const repolist = response.map((repo: GitHubRepoListResponse) => {
    const repoId = `${repo.id}`

    const repoObject: Repo = {
      id: repoId,
      name: repo.name,
      full_name: repo.full_name,
      clone_url: repo.clone_url,
      html_url: repo.html_url,
      service: 'github'
    }

    return repoObject
  }
  )

  return repolist
}

export const parseBitbucketRepositories = (response: BitbucketRepoListResponse): Repo[] => {
  const repolist = response.values.map(repo => {
    const clone_url = repo.links.clone.find(url => url.name === 'https')
    if (!clone_url) {
      throw Error('No clone url found, cannot append repo to list')
    }

    const repoObject: Repo = {
      id: repo.uuid,
      name: repo.name,
      full_name: repo.full_name,
      clone_url: clone_url.href,
      html_url: repo.links.html.href,
      service: 'bitbucket'
    }
    return repoObject
  })

  return repolist
}

export const parseGitlabRepositories = (response: GitLabRepoListResponse[]): Repo[] => {
  const repolist = response.map((repo: GitLabRepoListResponse) => {
    const repoId = `${repo.id}`

    const repoObject: Repo = {
      id: repoId,
      name: repo.name,
      full_name: repo.path_with_namespace,
      clone_url: repo.http_url_to_repo,
      html_url: repo.web_url,
      service: 'gitlab',
    }

    return repoObject
  })

  return repolist
}
