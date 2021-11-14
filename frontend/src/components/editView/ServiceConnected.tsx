import { useQuery } from '@apollo/client'
import React from 'react'
import {
  IS_BB_CONNECTED,
  IS_GH_CONNECTED,
  IS_GL_CONNECTED,
} from '../../graphql/queries'
import {
  IsBitbucketConnectedResult,
  IsGithubConnectedResult,
  IsGitLabConnectedResult,
} from '../../types'

const ServiceConnected = ({ service }: { service: string }) => {
  let connected = false
  let serviceCapitalized = ''

  const { data: GHConnectedQuery } =
    useQuery<IsGithubConnectedResult>(IS_GH_CONNECTED)
  const { data: GLConnectedQuery } =
    useQuery<IsGitLabConnectedResult>(IS_GL_CONNECTED)
  const { data: BBConnectedQuery } =
    useQuery<IsBitbucketConnectedResult>(IS_BB_CONNECTED)

  if (service === 'github') {
    connected = GHConnectedQuery ? GHConnectedQuery.isGithubConnected : false
    serviceCapitalized = 'GitHub'
  }

  if (service === 'gitlab') {
    connected = GLConnectedQuery ? GLConnectedQuery.isGitLabConnected : false
    serviceCapitalized = 'GitLab'
  }

  if (service === 'bitbucket') {
    connected = BBConnectedQuery ? BBConnectedQuery.isBitbucketConnected : false
    serviceCapitalized = 'Bitbucket'
  }

  return (
    <span
      style={{
        marginLeft: '1rem',
      }}
    >
      {connected
        ? `${serviceCapitalized} is connected. Saving will push to ${serviceCapitalized}`
        : `${serviceCapitalized} is not connected.`}
    </span>
  )
}

export default ServiceConnected
