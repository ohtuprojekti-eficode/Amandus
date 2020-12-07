import { UserType } from '../types/user'
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

export const cloneRepository = async (url: string): Promise<void> => {
  const repoLocation = getRepoLocationFromUrlString(url)
  await cloneRepositoryToSpecificFolder(url, repoLocation)
}

export const saveChanges = async (
  saveArgs: SaveArgs,
  user: UserType,
  remoteToken: string | undefined
): Promise<void> => {
  const { username, email } = user
  const { file, branch, commitMessage } = saveArgs

  const repositoryName = getRepositoryFromFilePath(file)
  const repoLocation = getRepoLocationFromRepoName(repositoryName)

  const realFilename = getFileNameFromFilePath(file, repositoryName)
  const sanitizedBranchName = sanitizeBranchName(branch)
  const validCommitMessage = makeCommitMessage(
    commitMessage,
    username,
    realFilename
  )

  const oldBranch = await getCurrentBranchName(repoLocation)
  const gitObject = getGitObject(repoLocation)

  await validateBranchName(sanitizedBranchName)
  await checkoutBranch(gitObject, sanitizedBranchName)
  writeToFile(file)
  await addChanges(gitObject, [realFilename])
  await commitAddedChanges(gitObject, username, email, validCommitMessage)

  if (remoteToken) {
    await doAutoMerge(gitObject, sanitizedBranchName, oldBranch)
    await pushWithToken(gitObject, username, remoteToken, sanitizedBranchName)
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
