/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppContext } from '../types/user'
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
  getRepoLocationFromRepoName,
  getServiceFromFilePath,
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
  username: string
): Promise<void> => {
  const repoLocation = getRepoLocationFromUrlString(url, username)
  await cloneRepositoryToSpecificFolder(url, repoLocation)
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

  const usedService = getServiceFromFilePath(firstFile.name)
  const currentService = context.currentUser.services?.find(
    (s) => s.serviceName === usedService
  )

  const amandusUser = context.currentUser
  const gitUsername = currentService?.username || amandusUser.username
  const email = currentService?.email || amandusUser.email

  const remoteToken = await tokenService.getAccessTokenByServiceAndId(
    amandusUser.id,
    usedService
  )

  const repositoryName = getRepositoryFromFilePath(firstFile.name)
  const repoLocation = getRepoLocationFromRepoName(
    repositoryName,
    amandusUser.username,
    usedService
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

  const usedService = getServiceFromFilePath(firstFile.name)
  const currentService = context.currentUser.services?.find(
    (s) => s.serviceName === usedService
  )

  const amandusUser = context.currentUser
  const gitUsername = currentService?.username || amandusUser.username
  const email = currentService?.email || amandusUser.email

  //TODO fix typescript errors for this funcy func
  const remoteToken = await tokenService.getAccessTokenByServiceAndId(
    amandusUser.id,
    usedService
  )
  const repositoryName = getRepositoryFromFilePath(firstFile.name)
  const repoLocation = getRepoLocationFromRepoName(
    repositoryName,
    amandusUser.username,
    usedService
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
  repoLocation: string,
  commitMessage: string,
  context: AppContext
): Promise<void> => {
  const amandusUser = context.currentUser
  const gitUsername = amandusUser.username
  const email = amandusUser.email

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
  return resetSingleFile(gitObject, realFilename)
}
  
export const resetAll = async (
  repoLocation: string
): Promise<string> => {
  const gitObject = getGitObject(repoLocation)
  const result = await gitReset(gitObject, 'hard')
  return result
}

