import React from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { UserType } from '../types'

interface Props {
  user: UserType
  logout: () => void
}

const padding = {
  paddingRight: 5,
}

const Header = ({ user, logout }: Props) => {
  return (
    <AppBar position="fixed" color="default" style={{ zIndex: 1250 }}>
      <Toolbar>
        <Link style={padding} to="/">
          Main menu
        </Link>
        <Link style={padding} to="/edit">
          Edit view
        </Link>
        {!user && (
          <Link style={padding} to="/login">
            Login
          </Link>
        )}
        {user && (
          <Link style={padding} to="/" onClick={logout}>
            {user.username} - logout
          </Link>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
