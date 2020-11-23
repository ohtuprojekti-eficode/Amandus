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
import RepositoriesView from './components/RepositoriesView'
import MyLoginForm from './components/MyLoginForm'

const App = () => {
  const { data: user } = useQuery(ME)

  const defaultColorTheme = 'light'
  const [colorTheme, setColorTheme] = useState<'light' | 'dark'>(() => {
    const userColorTheme = localStorage.getItem('colorTheme')
    if (userColorTheme === 'light' || userColorTheme === 'dark') {
      return userColorTheme
    }
    return defaultColorTheme
  })

  const toggleColorTheme = () => {
    const newColorTheme = colorTheme === 'light' ? 'dark' : 'light'
    setColorTheme(newColorTheme)
    localStorage.setItem('colorTheme', newColorTheme)
  }

  const theme = createMuiTheme({
    palette: {
      type: colorTheme,
    },
  })

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header
          user={user?.me}
          logout={logout}
          colorTheme={colorTheme}
          toggleColorTheme={toggleColorTheme}
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
