import { gql } from '@apollo/client'

export const AUTHORIZE_WITH_GH = gql`
  mutation authorizeWithGithub($code: String!) {
    authorizeWithGithub(code: $code) {
      serviceUser {
        serviceName
        username
        email
        reposurl
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

export const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`

export const ADD_SERVICE = gql`
  mutation connectGitService($service: AddServiceArgs!) {
    connectGitService(service: $service)
  }
`
