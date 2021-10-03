import { AppContext } from '../types/user'
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
  getServiceTokenFromAppContext,
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
} from '../utils/gitUtils'
// import { ServiceTokenType } from '../types/service'

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

export const cloneRepository = async (url: string, username: string): Promise<void> => {
  const repoLocation = getRepoLocationFromUrlString(url, username)
  await cloneRepositoryToSpecificFolder(url, repoLocation)
}

export const saveChanges = async (
  saveArgs: SaveArgs,
  context: AppContext
): Promise<void> => {
  const { file, branch, commitMessage } = saveArgs
  const usedService = getServiceFromFilePath(file)
  const currentService = context.currentUser
    .services?.find(s => s.serviceName === usedService)

  const amandusUser = context.currentUser
  const gitUsername = currentService?.username || amandusUser.username
  const email = currentService?.email || amandusUser.email

  const remoteToken = getServiceTokenFromAppContext({ service: usedService, appContext: context })

  const repositoryName = getRepositoryFromFilePath(file)
  const repoLocation =
    getRepoLocationFromRepoName(
      repositoryName,
      amandusUser.username,
      usedService
    )
  const realFilename = getFileNameFromFilePath(file)
  const sanitizedBranchName = sanitizeBranchName(branch)
  const validCommitMessage = makeCommitMessage(
    commitMessage,
    gitUsername,
    realFilename
  )

  const oldBranch = await getCurrentBranchName(repoLocation)
  const gitObject = getGitObject(repoLocation)

  await validateBranchName(sanitizedBranchName)
  await checkoutBranch(gitObject, sanitizedBranchName)

  writeToFile(file)

  await addChanges(gitObject, [realFilename])
  await commitAddedChanges(gitObject, gitUsername, email, validCommitMessage)

  console.log('token: ', remoteToken)
  if (remoteToken) {
    await doAutoMerge(gitObject, sanitizedBranchName, oldBranch)
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
