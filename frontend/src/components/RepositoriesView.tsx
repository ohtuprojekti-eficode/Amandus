import React from 'react'
import GitHubAuthBtn from './auth/GitHubAuthBtn'
import BitbucketAuthBtn from './auth/BitbucketAuthBtn'

const RepositoriesView = () => {
  return (
    <div style={{ marginTop: 15, marginLeft: 5 }}>
      <GitHubAuthBtn />
      <BitbucketAuthBtn />
    </div>
  )
}

export default RepositoriesView
