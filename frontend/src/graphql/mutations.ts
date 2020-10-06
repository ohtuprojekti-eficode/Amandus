import { gql } from '@apollo/client';


export const AUTHORIZE_WITH_GH = gql`
  mutation authorizeWithGithub($code: String!) {
    authorizeWithGithub(code: $code) {
      id
      username
      emails
    }
  }
`;