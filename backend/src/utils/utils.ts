/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFileSync } from 'fs'
import { File } from '../types/file'
import { sanitizeCommitMessage } from './sanitize'

import { ServiceName, ServiceTokenType } from '../types/service'
import { AppContext, UserForCommit } from '../types/user'



const execProm = promisify(exec)

export const validateBranchName = async (branchName: string): Promise<void> => {
  await runShellCommand(`git check-ref-format --branch ${branchName}`)
}

const runShellCommand = async (command: string): Promise<string> => {
  try {
    return (await execProm(command)).stdout
  } catch (e) {
    throw new Error((e as Error).message)
  }
}

export const pipe = <T>(...fns: Array<(a: T) => T>) => (x: T): T =>
  fns.reduce((value, func) => func(value), x)

export const getRepositoryFromFilePath = (filePath: string): string => {
  return filePath.split('/').slice(2, 4).join('/')
}

export const getServiceFromFilePath = (filePath: string): ServiceName => {
  return filePath.split('/')[1] as ServiceName
}

export const getFileNameFromFilePath = (
  filePath: string,
  repositoryName: string
): string => {
  return filePath.split(`${repositoryName}/`)[1] || filePath
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
  realFilenames: string[]
): string => {
  return rawCommitMessage
    ? sanitizeCommitMessage(rawCommitMessage)
    : `User ${username} modified file(s) ${realFilenames.join()}`
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
export const getRepoNameFromUrlString = (
  urlString: string
): string => {
  const url = new URL(urlString)
  const repositoryName =
    url.pathname.endsWith('.git')
      ? url.pathname.slice(0, -4)
      : url.pathname
  return repositoryName
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

export const getServiceUrlFromServiceName = (service: ServiceName): string => {
  switch (service) {
    case 'github':
      return 'github.com'
    case 'gitlab':
      return 'gitlab.com'
    case 'bitbucket':
      return 'bitbucket.org'
  }
}

/**
 * 
 * @param fileName: string
 * @param context: AppContext 
 * 
 * @returns usedService, gitUsername, email, repositoryName, repoLocation 
 */
export const extractUserForCommit = (fileName: string, context: AppContext): UserForCommit => {
  console.log('filename is: ', fileName)
  const usedService = getServiceFromFilePath(fileName)
  const currentService = context.currentUser.services?.find(
    (s) => s.serviceName === usedService
  )
  const amandusUser = context.currentUser
  const gitUsername = currentService?.username || context.currentUser.username
  const email = currentService?.email || amandusUser.email

  const repositoryName = getRepositoryFromFilePath(fileName)
  const repoLocation = getRepoLocationFromRepoName(
    repositoryName,
    amandusUser.username,
    usedService
  )

  const userForCommit: UserForCommit = {
    usedService,
    gitUsername,
    email,
    repositoryName,
    repoLocation
  }
  return userForCommit
}

