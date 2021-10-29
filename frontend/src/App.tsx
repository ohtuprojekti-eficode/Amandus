import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import Home from './components/Home'
import EditView from './components/EditView'
import Header from './components/Header'
import BBCallBack from './components/auth/BBCallBack'
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
import DeleteAccount from './components/DeleteAccount'
import { useLocation } from 'react-router-dom'
import SettingsPage from './components/SettingsPage'
import SettingsProvider from './components/SettingsProvider'

interface LocationState {
  cloneUrl: string
}

const App = () => {
  const { data: user } = useQuery<MeQueryResult>(ME)
  const location = useLocation<LocationState>()
  const [cloneUrl, setCloneUrl] = useState<string | undefined>(undefined)

  if (location.state?.cloneUrl && location.state.cloneUrl !== cloneUrl) setCloneUrl(location.state.cloneUrl)

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
    localStorage.removeItem('amandus-user-access-token')
    localStorage.removeItem('amandus-user-refresh-token')
    window.location.href = '/'
  }

  return (
    <div>
      <SettingsProvider>
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

          <Route exact path="/auth/bitbucket/callback">
            <BBCallBack />
          </Route>
          
          <Route path="/edit">
            <EditView 
            cloneUrl = {cloneUrl}/>
          </Route>

          <Route exact path="/repositories">
            <RepositoriesView />
          </Route>

          <Route exact path="/connections">
            <Connections />
          </Route>

          <Route exact path="/deleteAccount">
            <DeleteAccount 
             user = {user?.me}
            />
          </Route>
          
          <Route exact path="/settings">
            <SettingsPage
              user = {user?.me}
            />
          </Route>

          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/login" component={MyLoginForm} />
        </div>
      </ThemeProvider>
      </SettingsProvider>
    </div>
  )
}

export default App
