import { gql } from '@apollo/client'

export const ALL_FILES = gql`
  query {
    files: cloneRepository(
      url: "https://github.com/ohtuprojekti-eficode/robot-test-files"
    ) {
      name
      content
    }
  }
`

export const BRANCH_STATE = gql`
  query {
    repoState: getRepoState(
      url: "https://github.com/ohtuprojekti-eficode/robot-test-files"
    ) {
      branchName
    }
  }
`

export const GITHUB_LOGIN_URL = gql`
  query {
    githubLoginUrl
  }
`

export const ME = gql`
  query {
    me {
      id
      username
      emails
      gitHubId
      gitHubLogin
      gitHubEmail
      gitHubReposUrl
      gitHubToken
    }
  }
`
