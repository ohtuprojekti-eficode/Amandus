import simpleGit, { GitError, SimpleGit } from 'simple-git'
import { writeFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { File } from '../types/file'
import { UserType } from '../types/user'
import { sanitizeCommitMessage, sanitizeBranchName } from '../utils/sanitize'
import { validateBranchName } from '../utils/utils'
import { SaveArgs } from '../types/params'

export const getCurrentBranchName = async (
  repoLocation: string
): Promise<string> => {
  const git = simpleGit(repoLocation)
  const branches = await git.branchLocal()
  return branches.current
}

export const switchCurrentBranch = async (
  repoLocation: string,
  branchName: string
): Promise<string> => {
  const git = simpleGit(repoLocation)
  return await gitCheckout(git, branchName)
}

export const pullNewestChanges = async (httpsURL: string): Promise<void> => {
  const url = new URL(httpsURL)
  const repositoryName = url.pathname
  const repoLocation = `./repositories/${repositoryName}`

  const currentBranch = await getCurrentBranch(repoLocation)

  await simpleGit(`./repositories/${repositoryName}`)
    .fetch('origin')
    .branch([`--set-upstream-to=origin/${currentBranch}`, currentBranch])
    .pull()
    .catch((error: GitError) => {
      console.log(error)
    })
}

export const cloneRepository = async (httpsURL: string): Promise<void> => {
  const url = new URL(httpsURL)
  const repositoryName = url.pathname

  await simpleGit().clone(httpsURL, `./repositories/${repositoryName}`)
}

export const saveChanges = async (
  saveArgs: SaveArgs,
  user: UserType
): Promise<void> => {
  const { username, email } = user

  const { file, branch, commitMessage } = saveArgs

  const repositoryName = getRepositoryFromFilePath(file)

  const gitObject = setupGitConfig(username, email ?? '', repositoryName)

  await gitCheckout(gitObject, branch)

  writeToFile(file)

  const realFilename = getFileNameFromFilePath(file, repositoryName)
  await gitAdd(gitObject, [realFilename])

  const validCommitMessage = makeCommitMessage(
    commitMessage,
    username,
    realFilename
  )

  await gitCommit(gitObject, validCommitMessage)
  
}

export const saveChangesAndPush = async (
  saveArgs: SaveArgs,
  user: UserType,
  remoteToken: string
): Promise<void> => {
  const { username, email } = user

  const { file, branch, commitMessage } = saveArgs

  const repositoryName = getRepositoryFromFilePath(file)

  const gitObject = setupGitConfig(username, email ?? '', repositoryName)

  await gitCheckout(gitObject, branch)

  writeToFile(file)

  const realFilename = getFileNameFromFilePath(file, repositoryName)
  await gitAdd(gitObject, [realFilename])

  const validCommitMessage = makeCommitMessage(
    commitMessage,
    username,
    realFilename
  )

  await gitCommit(gitObject, validCommitMessage)

  await gitPush(gitObject, username, remoteToken, branch)
}

const getRepositoryFromFilePath = (file: File) => {
  return file.name.split('/').slice(0, 2).join('/')
}

const getFileNameFromFilePath = (file: File, repositoryName: string) => {
  return file.name.replace(`${repositoryName}/`, '') || file.name
}

const setupGitConfig = (
  username: string,
  email: string,
  repositoryName: string
): SimpleGit => {
  return simpleGit(`./repositories/${repositoryName}`)
    .addConfig('user.name', username)
    .addConfig('user.email', email)
}

const gitCheckout = async (git: SimpleGit, branchName: string) => {
  const sanitizedBranchName = sanitizeBranchName(branchName)
  await validateBranchName(sanitizedBranchName)

  if (await branchExists(git, sanitizedBranchName)) {
    await git.checkout([sanitizedBranchName])
  } else {
    await git.checkout(['-b', sanitizedBranchName])
  }
  return sanitizedBranchName
}

const branchExists = async (
  git: SimpleGit,
  branchName: string
): Promise<boolean> => {
  const branches = await git.branchLocal()
  return branches.all.some((branch) => branch === branchName)
}

const remoteBranchExists = async (
  git: SimpleGit,
  branchName: string
): Promise<boolean> => {
  const branches = await git.branch()
  return branches.all.some((branch) => branch === branchName)
}

const writeToFile = (file: File) => {
  writeFileSync(`./repositories/${file.name}`, file.content)
}

const gitAdd = async (git: SimpleGit, files: Array<string>) => {
  await git.add(files)
}

const makeCommitMessage = (
  rawCommitMessage: string,
  username: string,
  realFilename: string
) => {
  return rawCommitMessage
    ? sanitizeCommitMessage(rawCommitMessage)
    : `User ${username} modified file ${realFilename}`
}

const gitCommit = async (git: SimpleGit, commitMessage: string) => {
  await git.commit(commitMessage)
}

const gitPush = async (
  git: SimpleGit,
  username: string,
  token: string,
  branchName: string
) => {
  await git.fetch()

  const remoteExists = await remoteBranchExists(
    git,
    `remotes/origin/${branchName}`
  )

  if (remoteExists) {
    try {
      await git.merge([`origin/${branchName}`]).catch((error: GitError) => {
        if (error.message.includes('CONFLICT')) {
          throw new Error('Merge conflict')
        }
        throw new Error('Unexpected error')
      })
    } catch (e) {
      await git.merge(['--abort'])
      await git.reset(['--hard', 'HEAD~1'])
      throw e
    }
  }

  const remoteUuid = uuidv4()
  await gitAddRemote(git, remoteUuid, username, token)
  await git.push(remoteUuid, branchName)
  await gitRemoveRemote(git, remoteUuid)
}

const gitAddRemote = async (
  git: SimpleGit,
  remoteId: string,
  username: string,
  token: string
) => {
  await git.addRemote(
    remoteId,
    `https://${username}:${token}@github.com/ohtuprojekti-eficode/robot-test-files`
  )
}

const gitRemoveRemote = async (git: SimpleGit, remoteId: string) => {
  await git.removeRemote(remoteId)
}

export const getBranches = async (repoLocation: string): Promise<string[]> => {
  const git = simpleGit(repoLocation)
  const branches = await git.branch()
  return branches.all
}

export const getCurrentBranch = async (
  repoLocation: string
): Promise<string> => {
  const git = simpleGit(repoLocation)
  const branches = await git.branchLocal()
  return branches.current
}
