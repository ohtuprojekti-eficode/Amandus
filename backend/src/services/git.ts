/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppContext, UserType } from '../types/user'
import { StatusResult } from '../types/gitTypes'
import { SaveArgs } from '../types/params'
import { sanitizeBranchName } from '../utils/sanitize'
import {
  getFileNameFromFilePath,
  getRepoLocationFromUrlString,
  getRepositoryFromFilePath,
  makeCommitMessage,
  validateBranchName,
  writeToFile,
  getServiceNameFromUrlString,
  getServiceUrlFromServiceName,
  getRepoNameFromUrlString,
  extractUserForCommit,
} from '../utils/utils'
import {
  doAutoMerge,
  addChanges,
  checkoutBranch,
  commitAddedChanges,
  pushWithToken,
  getGitObject,
  getLocalBranchSummary,
  cloneRepositoryToSpecificFolder,
  updateBranchFromRemote,
  getLastCommitMessage,
  gitStatus,
  resetSingleFile,
  gitReset,
} from '../utils/gitUtils'
import tokenService from '../services/token'
import { ApolloError } from 'apollo-server-errors'

export const switchCurrentBranch = async (
  repoLocation: string,
  branchName: string
): Promise<string> => {
  const sanitizedBranchName = sanitizeBranchName(branchName)
  await validateBranchName(sanitizedBranchName)

  const gitObject = getGitObject(repoLocation)
  const switchedBranch = await checkoutBranch(gitObject, sanitizedBranchName)
  return switchedBranch
}

export const pullNewestChanges = async (
  repoLocation: string
): Promise<void> => {
  const currentBranch = await getCurrentBranchName(repoLocation)
  const gitObject = getGitObject(repoLocation)
  await updateBranchFromRemote(gitObject, currentBranch)
}

export const cloneRepository = async (
  url: string,
  user: UserType,
  cloneTo: typeof cloneRepositoryToSpecificFolder
    = cloneRepositoryToSpecificFolder
): Promise<void> => {
  const repoLocation = getRepoLocationFromUrlString(url, user.username)

  const service = getServiceNameFromUrlString(url)
  if (!service) {
    throw new Error(`Could not parse service from ${url}`);
  }

  const token = await tokenService.getAccessTokenByServiceAndId(user.id, service)
  if (!token) {
    throw new Error(`Could not find token for ${service}`);
  }

  const currentService = user.services?.find(
    (s) => s.serviceName === service
  )
  if (!currentService?.username) {
    throw new Error(`Could not find username for ${service}`);
  }

  const gitUsername = service === 'gitlab'
    ? 'oauth2'
    : currentService.username

  const repositoryName = getRepoNameFromUrlString(url)

  const urlWithCredentials =
    `https://${gitUsername}:${token}@${getServiceUrlFromServiceName(service)}${repositoryName}`

  await cloneTo(urlWithCredentials, repoLocation)
}

export const saveChanges = async (
  saveArgs: SaveArgs,
  context: AppContext
): Promise<void> => {
  const { files, branch, commitMessage } = saveArgs

  const firstFile = files[0]

  if (!firstFile) {
    throw new ApolloError('no files selected to commit')
  }

  const amandusUser = context.currentUser

  const {
    usedService,
    gitUsername,
    email,
    repositoryName,
    repoLocation
  } = extractUserForCommit(firstFile.name, context)

  const remoteToken = await tokenService.getAccessToken(
    amandusUser.id,
    usedService,
    context.accessToken
  )

  const realFilenames = files.map((file) =>
    getFileNameFromFilePath(file.name, repositoryName)
  )

  const sanitizedBranchName = sanitizeBranchName(branch)
  const validCommitMessage = makeCommitMessage(
    commitMessage,
    gitUsername,
    realFilenames
  )

  const gitObject = getGitObject(repoLocation)

  await validateBranchName(sanitizedBranchName)
  await checkoutBranch(gitObject, sanitizedBranchName)

  files.forEach((file) => writeToFile(file))

  await addChanges(gitObject, realFilenames)
  await commitAddedChanges(gitObject, gitUsername, email, validCommitMessage)

  if (remoteToken) {
    await doAutoMerge(gitObject, sanitizedBranchName)

    await pushWithToken(
      gitObject,
      gitUsername,
      remoteToken,
      sanitizedBranchName,
      usedService,
      repositoryName
    )
  }
}

export const saveMerge = async (
  saveArgs: SaveArgs,
  context: AppContext
): Promise<void> => {
  const { files, commitMessage } = saveArgs

  const firstFile = files[0]

  if (!firstFile) {
    throw new ApolloError('no files selected to commit')
  }

  const amandusUser = context.currentUser

  const {
    usedService,
    gitUsername,
    email,
    repositoryName,
    repoLocation
  } = extractUserForCommit(firstFile.name, context)

  const remoteToken = await tokenService.getAccessToken(
    amandusUser.id,
    usedService,
    context.accessToken
  )

  const realFilenames = files.map((file) =>
    getFileNameFromFilePath(file.name, repositoryName)
  )
  const currentBranch = await getCurrentBranchName(repoLocation)
  const validCommitMessage = makeCommitMessage(
    commitMessage,
    gitUsername,
    realFilenames
  )

  const gitObject = getGitObject(repoLocation)
  files.forEach((file) => writeToFile(file))
  await addChanges(gitObject, realFilenames)
  await commitAddedChanges(gitObject, gitUsername, email, validCommitMessage)

  if (remoteToken) {
    await pushWithToken(
      gitObject,
      gitUsername,
      remoteToken,
      currentBranch,
      usedService,
      repositoryName
    )
  }
}

export const getGitStatus = async (
  repoLocation: string
): Promise<StatusResult> => {
  const gitObject = getGitObject(repoLocation)
  const localGitStatus = await gitStatus(gitObject)
  return localGitStatus
}

export const getLocalBranches = async (
  repoLocation: string
): Promise<string[]> => {
  const gitObject = getGitObject(repoLocation)
  const branchSummary = await getLocalBranchSummary(gitObject)
  return branchSummary.all
}

export const getCurrentBranchName = async (
  repoLocation: string
): Promise<string> => {
  const gitObject = getGitObject(repoLocation)
  const branchSummary = await getLocalBranchSummary(gitObject)
  return branchSummary.current
}

export const getCurrentCommitMessage = async (
  repoLocation: string
): Promise<string> => {
  const gitObject = getGitObject(repoLocation)
  const commitMessage = await getLastCommitMessage(gitObject)
  return commitMessage
}

export const addAndCommitLocal = async (
  url: string,
  commitMessage: string,
  fileName: string,
  context: AppContext
): Promise<void> => {
  const repoLocation = getRepoLocationFromUrlString(
    url,
    context.currentUser.username
  )

  const {
    gitUsername,
    email,
  } = extractUserForCommit(fileName, context)

  const gitObject = getGitObject(repoLocation)
  const statusResult = await gitStatus(gitObject)
  const modifiedFiles: string[] = statusResult.modified
  await addChanges(gitObject, modifiedFiles)

  const validCommitMessage = makeCommitMessage(
    commitMessage,
    gitUsername,
    modifiedFiles
  )
  await commitAddedChanges(gitObject, gitUsername, email, validCommitMessage)
}

export const resetFile = async (
  url: string,
  fileName: string,
  context: AppContext
): Promise<string> => {
  const repoLocation = getRepoLocationFromUrlString(
    url,
    context.currentUser.username
  )
  const repositoryName = getRepositoryFromFilePath(fileName)
  const realFilename = getFileNameFromFilePath(fileName, repositoryName)
  const gitObject = getGitObject(repoLocation)
  return await resetSingleFile(gitObject, realFilename)
}

export const resetAll = async (
  repoLocation: string
): Promise<string> => {
  const gitObject = getGitObject(repoLocation)
  const result = await gitReset(gitObject, 'hard')
  return result
}

