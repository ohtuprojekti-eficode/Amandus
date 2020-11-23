import React from 'react'
import { Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ME } from './graphql/queries'
import EditView from './components/EditView'
import Header from './components/Header'
import CallBack from './components/auth/CallBack'
import { Toolbar } from '@material-ui/core'
import RegisterForm from './components/RegisterForm'
import RepositoriesView from './components/RepositoriesView'
import MyLoginForm from './components/MyLoginForm'

const App = () => {
  const { data: user } = useQuery(ME)

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <div>
      <Header user={user?.me} logout={logout} />
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
    </div>
  )
}

export default App
