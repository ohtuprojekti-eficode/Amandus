import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import EditView from './components/EditView'
import Header from './components/Header'
import CallBack from './components/auth/CallBack'
import RegisterForm from './components/RegisterForm'
import { CssBaseline, Toolbar } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { lightTheme, darkTheme } from './styles/themes'
import RepositoriesView from './components/RepositoriesView'
import MyLoginForm from './components/MyLoginForm'

const App = () => {
  const { data: user } = useQuery(ME)

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
          <Route path="/auth/github/callback">
            <CallBack />
          </Route>
          <Route path="/edit">
            <EditView />
          </Route>
          <Route exact path="/repositories">
            <RepositoriesView />
          </Route>
          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/login" component={MyLoginForm} />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default App
