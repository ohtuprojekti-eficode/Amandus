/* eslint-disable @typescript-eslint/unbound-method */

import { gql } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'
import { appendFileSync, mkdirSync, rmdirSync } from 'fs'
import { join } from 'path'
import simpleGit from 'simple-git'
import { server } from '../index'

const GET_REPO_STATE = gql`
  query repoState($url: String!) {
    getRepoState(url: $url) {
      currentBranch
      files {
        name
        content
      }
      branches
    }
  }
`

describe('getRepoState query', () => {
  const repoPath = join('.', 'repositories', 'testRepo')

  beforeEach(async () => {
    mkdirSync(repoPath, { recursive: true })
    await simpleGit(repoPath).init()
  })

  afterEach(() => {
    rmdirSync(repoPath, { recursive: true })
  })

  it('list of all branches is empty when no branches exist', async () => {
    const { query } = createTestClient(server)

    const res = await query({
      query: GET_REPO_STATE,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    const branches = res.data?.getRepoState.branches
    expect(branches).toEqual([])
  })

  it('list of all branches contains correct branches', async () => {
    appendFileSync(
      `${repoPath}/file.txt`,
      'Commit and add file to create master branch'
    )

    const testRepo = simpleGit(repoPath)
    await testRepo
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const { query } = createTestClient(server)

    const res = await query({
      query: GET_REPO_STATE,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    const branches = res.data?.getRepoState.branches
    expect(branches).toEqual(['master', 'secondBranch'])
  })

  it('list of current files is empty when no files exist', async () => {
    const { query } = createTestClient(server)

    const res = await query({
      query: GET_REPO_STATE,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    const files = res.data?.getRepoState.files
    expect(files).toEqual([])
  })

  it('list of all files contains correct files', async () => {
    appendFileSync(
      `${repoPath}/file.txt`,
      'Commit and add file to create master branch'
    )

    const testRepo = simpleGit(repoPath)
    await testRepo
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const { query } = createTestClient(server)

    const res = await query({
      query: GET_REPO_STATE,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    const files = res.data?.getRepoState.files
    const fakeFile = {
      name: `testRepo/file.txt`,
      content: 'Commit and add file to create master branch',
    }
    const expectedFiles = [fakeFile]
    expect(files).toEqual(expectedFiles)
  })

  it('current branch name is empty when branch status is unknown', async () => {
    const { query } = createTestClient(server)

    const res = await query({
      query: GET_REPO_STATE,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    const currentBranch = res.data?.getRepoState.currentBranch
    expect(currentBranch).toEqual('')
  })

  it('current branch name is correct', async () => {
    appendFileSync(
      `${repoPath}/file.txt`,
      'Commit and add file to create master branch'
    )

    const testRepo = simpleGit(repoPath)
    await testRepo
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const { query } = createTestClient(server)

    const res = await query({
      query: GET_REPO_STATE,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    const currentBranch = res.data?.getRepoState.currentBranch
    expect(currentBranch).toEqual('master')
  })
})
