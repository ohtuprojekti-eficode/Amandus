import simpleGit, { BranchSummary, GitError, SimpleGit, StatusResult } from 'simple-git'
import { v4 as uuidv4 } from 'uuid'
import { ServiceName } from '../types/service'

export const gitRemoveRemote = async (
  git: SimpleGit,
  remoteId: string
): Promise<void> => {
  await git.removeRemote(remoteId)
}

export const addChanges = async (
  git: SimpleGit,
  files: Array<string>
): Promise<void> => {
  await git.add(files)
}

export const commitAddedChanges = async (
  git: SimpleGit,
  username: string,
  email: string,
  commitMessage: string
): Promise<void> => {
  // Overwrites config details in repository location
  // Appending causes problems with selecting what details to use
  await git
    .addConfig('user.name', username)
    .addConfig('user.email', email)
    .commit(commitMessage)
}

export const localBranchExists = async (
  git: SimpleGit,
  branchName: string
): Promise<boolean> => {
  const branches = await git.branchLocal()
  return branches.all.some((branch) => branch === branchName)
}

export const remoteBranchExists = async (
  git: SimpleGit,
  branchName: string
): Promise<boolean> => {
  const branches = await git.branch()
  return branches.all.some((branch) => branch === branchName)
}

export const getGitObject = (repoLocation: string): SimpleGit => {
  return simpleGit(repoLocation)
}

export const gitAddRemote = async (
  git: SimpleGit,
  remoteId: string,
  username: string,
  token: string,
  service: ServiceName,
  repositoryName: string
): Promise<void> => {
  const serviceUrl = (service: ServiceName): string => {
    switch (service) {
      case 'github':
        return 'github.com'
      case 'gitlab':
        return 'gitlab.com'
      case 'bitbucket':
        return 'bitbucket.org'
    }
  }

  if (service === 'gitlab') username = 'oauth2'

  await git.addRemote(
    remoteId,
    `https://${username}:${token}@${serviceUrl(service)}/${repositoryName}`
  )
}


export const checkoutBranch = async (
  git: SimpleGit,
  branchName: string
): Promise<string> => {
  if (await localBranchExists(git, branchName)) {
    await git.checkout([branchName])
  } else {
    await git.checkout(['-b', branchName])
  }
  return branchName
}

export const doAutoMerge = async (
  git: SimpleGit,
  branchName: string
): Promise<void> => {
  await git.fetch()

  const remoteExists = await remoteBranchExists(
    git,
    `remotes/origin/${branchName}`
  )

  if (remoteExists) {
    await git.merge([`origin/${branchName}`]).catch((error: GitError) => {
      if (error.message.includes('CONFLICT')) {
        throw new Error('Merge conflict')
      }
      throw new Error('Unexpected error')
    })
  }
}

export const pushWithToken = async (
  git: SimpleGit,
  username: string,
  token: string,
  branchName: string,
  service: ServiceName,
  repositoryName: string
): Promise<void> => {
  const remoteUuid = uuidv4()
  await gitAddRemote(
    git,
    remoteUuid,
    username,
    token,
    service,
    repositoryName
  )
  try {
    await git.push(remoteUuid, branchName)
  } catch (e) {
    console.log(e)
  }

  await gitRemoveRemote(git, remoteUuid)
}

export const getLocalBranchSummary = async (
  git: SimpleGit
): Promise<BranchSummary> => {
  return await git.branchLocal()
}

export const getLastCommitMessage = async (git: SimpleGit): Promise<string> => {
  try {
    const commitMessage = await git.raw(['show', '-s', '--format=%s'])
    if (commitMessage.length > 73) {
      return commitMessage.slice(0, 72).concat('...').replace('\n', '')
    }
    return commitMessage.replace('\n', '')
  } catch (e) {
    return ''
  }
}

export const cloneRepositoryToSpecificFolder = async (
  url: string,
  repoLocation: string
): Promise<void> => {
  await simpleGit().clone(url, repoLocation)
}

export const updateBranchFromRemote = async (
  git: SimpleGit,
  branchname: string
): Promise<void> => {
  await git.fetch()

  const remoteBranchName = `remotes/origin/${branchname}`
  const remoteExists = await remoteBranchExists(git, remoteBranchName)

  if (remoteExists) {
    await setUpstreamForBranch(git, branchname)
    await pullToCurrentBranch(git)
  }
}

export const setUpstreamForBranch = async (
  git: SimpleGit,
  branchname: string
): Promise<void> => {
  await git.branch([`--set-upstream-to=origin/${branchname}`, branchname])
}

export const pullToCurrentBranch = async (git: SimpleGit): Promise<void> => {
  await git.pull()
}

export const gitStatus = async (
  git: SimpleGit,
  _options?: string[]
): Promise<StatusResult> => {
  const statusResult = await git.status()
  return statusResult
}

export const resetSingleFile = async (
  git: SimpleGit,
  fileName: string
): Promise<string> => {
  return await git.checkout('HEAD', ['--', fileName])
}
