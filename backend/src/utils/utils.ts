/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync } from 'fs'
import { File } from '../types/file'
import { sanitizeCommitMessage } from './sanitize'
import { AppContext } from '../types/user'
import { Repo } from '../types/repo'

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
  return file.name.split('/').slice(0, 2).join('/')
}

export const getFileNameFromFilePath = (
  file: File,
  repositoryName: string
): string => {
  return file.name.replace(`${repositoryName}/`, '') || file.name
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

export const getRepoLocationFromUrlString = (urlString: string): string => {
  const url = new URL(urlString)
  const repositoryName = url.pathname
  const repoLocation = `./repositories${repositoryName}`
  return repoLocation
}

export const getRepoLocationFromRepoName = (repositoryName: string): string => {
  const repoLocation = `./repositories/${repositoryName}`
  return repoLocation
}

export const getServiceTokenFromContext = (serviceName: string, context: AppContext): string | undefined => {
    switch(serviceName){
      case 'github': return context.githubToken;
      case 'bitbucket': return context.bitbucketToken;
      case 'gitlab': return context.gitlabToken;
      default: return undefined;
    }
}

export const parseGithubRepositories = (response: any): Repo[] => {
  const repolist = response.map((repo: Repo) => {
    const repoObject: Repo = {
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      clone_url: repo.clone_url,
      html_url: repo.html_url,
      service: 'github'
    }
    return (
      repoObject
      )}
    )

  return repolist
}

export const parseBitbucketRepositories = (response: any): Repo[] => {
  const repolist = response.values.map((repo: any) => {
    const clone_url = repo.links.clone.find((url: { name: string }) => url.name === 'https')

    let repoObject: Repo = {
      id: repo.uuid,
      name: repo.name,
      full_name: repo.full_name,
      clone_url: clone_url.href,
      html_url: repo.html_url,
      service: 'bitbucket'
    }
    return repoObject
  })

  return repolist
}

export const parseGitlabRepositories = (response: any): Repo[] => {
  console.log('PARSING GITLAB REPOSITORIES...')
  console.log(`gitlab json response: ${response}`)
  const repolist = response.map((repo: any) => {
    let repoObject: Repo = {
      id: repo.id,
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
