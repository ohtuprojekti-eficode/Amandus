import React from 'react'
import GitHubAuthBtn from './auth/GitHubAuthBtn'
import GitLabAuthBtn from './auth/GitLabAuthBtn'

const RepositoriesView = () => {
  return (
    <div style={{ marginTop: 15, marginLeft: 5 }}>
      <GitHubAuthBtn />
      <GitLabAuthBtn />
    </div>
  )
}

export default RepositoriesView
