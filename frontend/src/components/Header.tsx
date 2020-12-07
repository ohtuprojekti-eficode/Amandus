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

const stylesInUse = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: 1250,
    },
    linkBtnTransparent: {
      padding: '0.8em 1em',
      border: '1px solid transparent',
      "&:hover": {
        textDecoration: 'none',
        opacity: 0.8,
      },
    },
    linkBtnBordered: {
      padding: '0.8em 1em',
      borderRadius: '4px',
      border: '1px solid rgba(98,0,238, 0.4)',
      "&:hover": {
        textDecoration: 'none',
        backgroundColor: 'rgba(0,0,0,0.02)',
        opacity: 0.8,
      }
    },
    loginGreet: {
      fontSize: '.95em',
      marginRight: '1em',
    },
    section: {
      flexGrow: 1,
    }
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
    <div className={classes.root}>
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Toolbar>
          
          <Logo theme={theme} />

          <div className={classes.section}>
            <Link component={RouterLink} className={classes.linkBtnTransparent} to="/edit">
              Edit view
            </Link>
          
            {user && (
              <Link
                component={RouterLink}
                className={classes.linkBtnTransparent}
                to="/repositories"
              >
                Repositories
              </Link>
            )}

            <Switch
              checked={switchChecked}
              onChange={handleSwitchToggle}
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>

          <div>
            {!user && (
              <Link component={RouterLink} className={classes.linkBtnTransparent} to="/login">
                Login
              </Link>
            )}
            {!user && (
              <Link component={RouterLink} className={classes.linkBtnBordered} to="/register">
                Register
              </Link>
            )}
            {user && (
              <div>
              <span className={classes.loginGreet}>Hello, {user.username}</span>
                <Link
                  component={RouterLink}
                  className={classes.linkBtnBordered}
                  to="/"
                  onClick={logout}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
          
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
