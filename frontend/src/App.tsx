import React from 'react'
import { Route, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import EditView from './components/EditView'
import LoginForm from './components/LoginForm'
import CallBack from './components/auth/CallBack'
import { AppBar, Toolbar } from '@material-ui/core'

const App = () => {
  const { data: user } = useQuery(ME)

  const padding = {
    paddingRight: 5,
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div>
      <AppBar position="fixed" color="default" style={{ zIndex: 1250 }}>
        <Toolbar>
          <Link style={padding} to="/">
            Main menu
          </Link>
          <Link style={padding} to="/edit">
            Edit view
          </Link>
          {(!user || !user.me) && (
            <Link style={padding} to="/login">
              Login
            </Link>
          )}
          {user && user.me && (
            <Link style={padding} to="/" onClick={logout}>
              {user.me.username} - logout
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <div>
        <Toolbar />
        <Route path="/auth/github/callback">
          <CallBack />
        </Route>
        <Route path="/edit">
          <EditView />
        </Route>
        <Route exact path="/login" component={LoginForm} />
      </div>
    </div>
  )
}

export default App
