import { gql } from '@apollo/client'

export const AUTHORIZE_WITH_GH = gql`
  mutation authorizeWithGithub($code: String!) {
    authorizeWithGithub(code: $code) {
      user {
        id
        username
        emails
        gitHubId
        gitHubLogin
        gitHubEmail
        gitHubReposUrl
        gitHubToken
      }
      token
    }
  }
`

export const SAVE_CHANGES = gql`
  mutation saveChanges(
    $file: FileInput!
    $branch: String!
    $commitMessage: String
  ) {
    saveChanges(file: $file, branch: $branch, commitMessage: $commitMessage)
  }
`

export const SWITCH_BRANCH = gql`
  mutation switchBranch($url: String!, $branch: String!) {
    switchBranch(url: $url, branch: $branch)
  }
`
