import React from 'react'
import { Toolbar } from '@material-ui/core'
import GitHubAuthBtn from './auth/GitHubAuthBtn'

const LoginForm = () => {
  return (
    <div style={{ marginTop: 15, marginLeft: 5 }}>
      <Toolbar />
      <GitHubAuthBtn />
    </div>
  )
}

export default LoginForm
