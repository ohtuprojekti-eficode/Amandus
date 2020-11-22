import React, { useState } from 'react'
import { AppBar, Switch, Toolbar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { UserType } from '../types'

interface Props {
  user: UserType
  logout: () => void
  colorTheme: string
  toggleColorTheme: () => void
}

const padding = {
  paddingRight: 5,
}

const Header = ({ user, logout, colorTheme, toggleColorTheme }: Props) => {
  const [switchChecked, setSwitchChecked] = useState(colorTheme === 'dark')

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
    toggleColorTheme()
  }

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
        {!user && (
          <Link style={padding} to="/register">
            Register
          </Link>
        )}
        {user && (
          <Link style={padding} to="/" onClick={logout}>
            {user.username} - logout
          </Link>
        )}
        <Switch
          checked={switchChecked}
          onChange={handleSwitchToggle}
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </Toolbar>
    </AppBar>
  )
}

export default Header
