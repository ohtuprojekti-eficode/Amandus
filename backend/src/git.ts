import simpleGit, { SimpleGit } from 'simple-git'

export const cloneRepository = async (httpsURL: string): Promise<void> => {
  const git: SimpleGit = simpleGit()

  const url = new URL(httpsURL)
  const repositoryName = url.pathname.split('.')[0]

  await git.clone(httpsURL, `./repositories/${repositoryName}`)
}
