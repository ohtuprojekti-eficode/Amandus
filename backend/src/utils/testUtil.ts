import simpleGit from 'simple-git'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { File } from '../types/file'

export const initTestRepo = (): void => {
  const repoPath = path.join(
    'testRepositories',
    'testuser',
    'github',
    'testuser',
    'e2etest'
  )

  mkdirSync(repoPath, { recursive: true })
  mkdirSync(repoPath + '/robots/', { recursive: true })

  const git = simpleGit(repoPath)

  const files: File[] = [
    { name: 'README.md', content: 'This is a README.md' },
    { name: 'robots/login.robot', content: 'login robot file' },
    { name: 'robots/resource.robot', content: 'resource robot file' },
  ]

  files.forEach((file) =>
    writeFileSync(`${repoPath}/${file.name}`, file.content)
  )

  git
    .init()
    .add(files.map((file) => file.name))
    .addConfig('user.name', 'testuser')
    .addConfig('user.email', 'testuser@testus.er')
    .commit('e2e commit')
    .catch((e) => console.log(e))
}
