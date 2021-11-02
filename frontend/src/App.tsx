import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import Home from './components/Home'
<<<<<<< HEAD
import EditView from './components/editView/EditView'
=======
import EditView from './components/EditView/EditView'
>>>>>>> 608e904b4201ffa475c77b673ffe13d36e17a477
import Header from './components/Header'
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
import CallBack from './components/auth/CallBack'

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
            <CallBack
            service = {'github'}/>
          </Route>
          <Route exact path="/auth/gitlab/callback">
            <CallBack
            service = {'gitlab'} />
          </Route>

          <Route exact path="/auth/bitbucket/callback">
            <CallBack
            service = {'bitbucket'} />
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

          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/login" component={MyLoginForm} />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default App
