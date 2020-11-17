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
const SWITCH_BRANCH = gql`
  mutation switchBranch($url: String!, $branch: String!) {
    switchBranch(url: $url, branch: $branch)
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

describe('switchBranch mutation', () => {
  const repoPath = join('.', 'repositories', 'testRepo')

  beforeEach(async () => {
    mkdirSync(repoPath, { recursive: true })
    await simpleGit(repoPath).init()

    appendFileSync(
      `${repoPath}/file.txt`,
      'Commit and add file to create master branch'
    )
  })

  afterEach(() => {
    rmdirSync(repoPath, { recursive: true })
  })

  it('switches current branch to given existing branch', async () => {
    const testRepo = simpleGit(repoPath)
    await testRepo
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const { mutate } = createTestClient(server)

    await mutate({
      mutation: SWITCH_BRANCH,
      variables: {
        url: 'http://www.remote.org/testRepo',
        branch: 'secondBranch',
      },
    })

    const branches = await testRepo.branchLocal()
    expect(branches.current).toEqual('secondBranch')
  })

  it('returns the name of the branch it switched to', async () => {
    const testRepo = simpleGit(repoPath)
    await testRepo
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const { mutate } = createTestClient(server)

    const res = await mutate({
      mutation: SWITCH_BRANCH,
      variables: {
        url: 'http://www.remote.org/testRepo',
        branch: 'secondBranch',
      },
    })

    const currentBranch = res.data?.switchBranch
    expect(currentBranch).toEqual('secondBranch')
  })

  it('creates a new branch when switching to branch that does not exist', async () => {
    const testRepo = simpleGit(repoPath)
    await testRepo
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const { mutate } = createTestClient(server)

    await mutate({
      mutation: SWITCH_BRANCH,
      variables: {
        url: 'http://www.remote.org/testRepo',
        branch: 'thirdBranch',
      },
    })
    const branches = await testRepo.branchLocal()
    expect(branches.current).toEqual('thirdBranch')
  })
})
