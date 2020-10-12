import simpleGit, { SimpleGit } from 'simple-git'
import { writeFileSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

interface File {
  name: string
  content: string
}

export const pullMasterChanges = async (httpsURL: string): Promise<void> => {
  const url = new URL(httpsURL)
  const repositoryName = url.pathname

  await simpleGit(`./repositories/${repositoryName}`)
    .fetch('origin')
    .pull('origin', 'master')
}

export const cloneRepository = async (httpsURL: string): Promise<void> => {
  const url = new URL(httpsURL)
  const repositoryName = url.pathname

  await simpleGit().clone(httpsURL, `./repositories/${repositoryName}`)
}

export const saveChanges = async (
  file: File,
  username: string,
  email: string,
  token: string
): Promise<void> => {
  const repositoryName = file.name.split('/').slice(0, 2).join('/')
  const realFilename = file.name.replace(`${repositoryName}/`, '') || file.name
  const branchName = `${username}-${new Date()
    .toLocaleString()
    .replace(/[\s|:]/g, '-')}`
  const commitMessage = `User ${username} modified file ${realFilename}`
  const remoteUuid = uuidv4()

  const git = simpleGit(`./repositories/${repositoryName}`)
    .addConfig('user.name', username)
    .addConfig('user.email', email)

  await git.checkout(['master'])
  await git.checkout(['-b', branchName])

  writeFileSync(`./repositories/${file.name}`, file.content)

  await git.add([realFilename])
  await git.commit(commitMessage)
  await git.addRemote(
    remoteUuid,
    `https://${username}:${token}@github.com/ohtuprojekti-eficode/robot-test-files`
  )
  await git.push(remoteUuid, branchName)
  await git.removeRemote(remoteUuid)
  await git.checkout(['master'])
  await git.branch(['-D', branchName])
}
