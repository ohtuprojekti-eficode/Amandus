import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import Home from './components/Home'
import EditView from './components/EditView'
import Header from './components/Header'
import GHCallBack from './components/auth/GHCallBack'
import GLCallBack from './components/auth/GLCallBack'
import RegisterForm from './components/RegisterForm'
import { CssBaseline, Toolbar } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { lightTheme, darkTheme } from './styles/themes'
import RepositoriesView from './components/RepositoriesView'
import Connections from './components/Connections'
import MyLoginForm from './components/MyLoginForm'
import { MeQueryResult } from './types'

const App = () => {
  const { data: user } = useQuery<MeQueryResult>(ME)

  const defaultTheme = 'light'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const userTheme = localStorage.getItem('theme')
    if (userTheme === 'light' || userTheme === 'dark') {
      return userTheme
    }
    return defaultTheme
  })

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const appliedTheme = createMuiTheme(
    theme === 'light' ? lightTheme : darkTheme
  )

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <div>
      <ThemeProvider theme={appliedTheme}>
        <CssBaseline />
        <Header
          user={user?.me}
          logout={logout}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <div>
          <Toolbar />

          <Route exact path="/">
            <Home />
          </Route>

          <Route exact path="/auth/github/callback">
            <GHCallBack />
          </Route>
          <Route exact path="/auth/gitlab/callback">
            <GLCallBack />
          </Route>

          <Route path="/edit">
            <EditView />
          </Route>

          <Route exact path="/repositories">
            <RepositoriesView />
          </Route>

          <Route exact path="/connections">
            <Connections />
          </Route>

          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/login" component={MyLoginForm} />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default App
