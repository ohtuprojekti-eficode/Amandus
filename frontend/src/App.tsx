import Notification from './components/Notification/Notification'
import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import Home from './components/Home'
import EditView from './components/editView/EditView'
import Header from './components/Header'
import RegisterForm from './components/RegisterForm'
import { CssBaseline, Toolbar } from '@material-ui/core'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { lightTheme, darkTheme } from './styles/themes'
import RepositoriesView from './components/RepositoriesView'
import Connections from './components/Connections'
import MyLoginForm from './components/MyLoginForm'
import DeleteAccount from './components/DeleteAccount'
import { useLocation } from 'react-router-dom'
import CallBack from './components/auth/CallBack'
import SettingsPage from './components/settingsPage/SettingsPage'
import SettingsProvider from './components/SettingsProvider'
import NotificationProvider from './components/Notification/NotificationProvider'
import useUser from './hooks/useUser'

interface LocationState {
  cloneUrl: string
}

const App = () => {
  const { user } = useUser()

  const location = useLocation<LocationState>()
  const [cloneUrl, setCloneUrl] = useState<string | undefined>(undefined)

  if (location.state?.cloneUrl && location.state.cloneUrl !== cloneUrl)
    setCloneUrl(location.state.cloneUrl)

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

  const appliedTheme = createTheme(theme === 'light' ? lightTheme : darkTheme)

  return (
    <div>
      <SettingsProvider>
        <ThemeProvider theme={appliedTheme}>
          <NotificationProvider>
            <CssBaseline />
            <Notification />
            <Header user={user?.me} theme={theme} toggleTheme={toggleTheme} />
            <div>
              <Toolbar />

              <Route exact path="/">
                <Home />
              </Route>

              <Route exact path="/auth/github/callback">
                <CallBack service={'github'} />
              </Route>
              <Route exact path="/auth/gitlab/callback">
                <CallBack service={'gitlab'} />
              </Route>

              <Route exact path="/auth/bitbucket/callback">
                <CallBack service={'bitbucket'} />
              </Route>

              <Route path="/edit">
                <EditView cloneUrl={cloneUrl} />
              </Route>

              <Route exact path="/repositories">
                <RepositoriesView />
              </Route>

              <Route exact path="/connections">
                <Connections />
              </Route>

              <Route exact path="/deleteAccount">
                <DeleteAccount user={user?.me} />
              </Route>

              <Route exact path="/settings">
                <SettingsPage user={user?.me} />
              </Route>

              <Route exact path="/register" component={RegisterForm} />
              <Route exact path="/login" component={MyLoginForm} />
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </div>
  )
}

export default App
