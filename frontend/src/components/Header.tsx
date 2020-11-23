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

interface Props {
  user: UserType
  logout: () => void
  colorTheme: string
  toggleColorTheme: () => void
}

const stylesInUse = makeStyles((theme) =>
  createStyles({
    appBar: {
      zIndex: 1250,
    },
    link: {
      paddingRight: 10,
      color: theme.palette.primary.main,
    },
  })
)

const Header = ({ user, logout, colorTheme, toggleColorTheme }: Props) => {
  const [switchChecked, setSwitchChecked] = useState(colorTheme === 'dark')
  const classes = stylesInUse()

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
    toggleColorTheme()
  }

  return (
    <AppBar position="fixed" color="default" className={classes.appBar}>
      <Toolbar>
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
