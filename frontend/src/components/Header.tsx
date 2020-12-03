import React, { useState } from 'react'
import {
  AppBar,
  createStyles,
  Link,
  makeStyles,
  Switch,
  Toolbar,
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { UserType } from '../types'
import Logo from './Logo'

interface Props {
  user: UserType
  logout: () => void
  theme: string
  toggleTheme: () => void
}

const stylesInUse = makeStyles((theme) =>
  createStyles({
    appBar: {
      zIndex: 1250,
    },
    link: {
      paddingRight: 10,
    },
  })
)

const Header = ({ user, logout, theme, toggleTheme }: Props) => {
  const [switchChecked, setSwitchChecked] = useState(theme === 'dark')
  const classes = stylesInUse()

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
    toggleTheme()
  }

  return (
    <AppBar position="fixed" color="default" className={classes.appBar}>
      <Toolbar>
        
        <Logo theme={theme} />

        <Link component={RouterLink} className={classes.link} to="/">
          Main menu
        </Link>
        <Link component={RouterLink} className={classes.link} to="/edit">
          Edit view
        </Link>
        {user && (
          <Link
            component={RouterLink}
            className={classes.link}
            to="/repositories"
          >
            Repositories
          </Link>
        )}
        {!user && (
          <Link component={RouterLink} className={classes.link} to="/login">
            Login
          </Link>
        )}
        {!user && (
          <Link component={RouterLink} className={classes.link} to="/register">
            Register
          </Link>
        )}
        {user && (
          <Link
            component={RouterLink}
            className={classes.link}
            to="/"
            onClick={logout}
          >
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
