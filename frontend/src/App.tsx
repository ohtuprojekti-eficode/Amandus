import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import EditView from './components/EditView'
import Header from './components/Header'
import LoginForm from './components/LoginForm'
import CallBack from './components/auth/CallBack'
import RegisterForm from './components/RegisterForm'
import { CssBaseline, Toolbar } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const App = () => {
  const { data: user } = useQuery(ME)

  const defaultColorTheme = 'light'
  const [colorTheme, setColorTheme] = useState<'light' | 'dark'>(
    defaultColorTheme
  )

  const toggleColorTheme = () => {
    const newColorTheme = colorTheme === 'light' ? 'dark' : 'light'
    setColorTheme(newColorTheme)
  }

  const theme = createMuiTheme({
    palette: {
      type: colorTheme,
    },
  })

  const logout = () => {
    localStorage.clear()
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
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/register" component={RegisterForm} />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default App
