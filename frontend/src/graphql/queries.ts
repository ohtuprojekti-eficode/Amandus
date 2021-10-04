import { gql } from '@apollo/client'

export const REPO_STATE = gql`
  query getRepoState($repo_url: String!) {
    repoState: getRepoState(
      url: $repo_url
    ) {
      currentBranch
      files {
        name
        content
      }
      branches
      url
      commitMessage
    }
  }
`

export const IS_GH_CONNECTED = gql`
  query {
    isGithubConnected
  }
`

export const IS_BB_CONNECTED = gql`
  query {
    isBitbucketConnected
  }
`

export const IS_GL_CONNECTED = gql`
  query {
    isGitLabConnected
  }
`

export const CLONE_REPO = gql`
  query cloneRepo($clone_url: String!) {
    cloneRepository(url: $clone_url)
  }
`

export const GITHUB_LOGIN_URL = gql`
  query {
    githubLoginUrl
  }
`

export const BITBUCKET_LOGIN_URL = gql`
  query {
    bitbucketLoginUrl
  }
`

export const GITLAB_LOGIN_URL = gql`
  query {
    gitLabLoginUrl
  }
`

export const ME = gql`
  query {
    me {
      username
      user_role
      email
      services {
        serviceName
        username
        email
        reposurl
      }
    }
  }
`
export const GET_REPO_LIST = gql`
  query {
    getRepoListFromService {
      id
      name
      full_name
      clone_url
      html_url
      service
    }
  }
`