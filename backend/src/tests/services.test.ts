/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { requestBitbucketUser } from "../services/bitbucket"
import { requestGithubUser } from "../services/gitHub"
import { requestGitLabUser } from "../services/gitLab"

// import fetch from 'node-fetch'
jest.mock('node-fetch', () => require('./mocks/fetch'))

describe('Bitbucket API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requestBitbucketUser returns correct access_token, refresh_token, username, reposurl and email from mock', async () => {
    const bitbucketUser = await requestBitbucketUser('123code321')
    expect(bitbucketUser.response.access_token).toBe('immatokenlol')
    expect(bitbucketUser.response.refresh_token).toBe('immarefreshtokenlol')
    expect(bitbucketUser.serviceUser.username).toBe('elvis')
    expect(bitbucketUser.serviceUser.reposurl).toBe('https://api.bitbucket.org/2.0/repositories/elvis')
    expect(bitbucketUser.serviceUser.email).toBe('elvis@detroit.us')
  })
})

describe('Gitlab API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requestGitlabUser returns correct access_token, refresh_token username and email from mock', async () => {
    const gitlabUser = await requestGitLabUser('123code321')
    expect(gitlabUser.response.access_token).toBe('immatokenlol')
    expect(gitlabUser.response.refresh_token).toBe('immarefreshtokenlol')
    expect(gitlabUser.serviceUser.username).toBe('elvis')
    expect(gitlabUser.serviceUser.email).toBe('elvis@detroit.us')
  })

  it('requestGitlabUser returns correct reposurl', async () => {
    const gitlabUser = await requestGitLabUser('123code321')
    expect(gitlabUser.serviceUser.reposurl).toBe('https://gitlab.com/api/v4/projects?simple=true&min_access_level=30')  
  })
})

describe('Github API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('requestGithubUser returns correct access_token, username, reposurl and email from mock', async () => {
    const githubUser = await requestGithubUser('123code321')
    expect(githubUser.response.access_token).toBe('immatokenlol')
    expect(githubUser.serviceUser.username).toBe('elvis')
    expect(githubUser.serviceUser.email).toBe('elvis@detroit.us')
    expect(githubUser.serviceUser.reposurl).toBe('https://api.github.com/elvis/repos')
  })
})
