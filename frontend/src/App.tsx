import React from 'react'
import { Route, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { ALL_FILES } from './graphql/queries'
import { ME } from './graphql/queries'
import ListView from './components/ListView'
import EditView from './components/EditView'
import LoginForm from './components/LoginForm'
import CallBack from './components/auth/CallBack'

const App = () => {
  const result = useQuery(ALL_FILES)
  const { loading: userQueryLoading, error: userQueryError, data: user } = useQuery(ME)

  if (result.loading) return <div>Loading...</div>
  if (result.error) return <div>Error fetching files...</div>

  const padding = {
    paddingRight: 5,
  }

  return (
    <div>
      <Link style={padding} to="/">
        Main menu
      </Link>
      <Link style={padding} to="/filelist">
        File listing
      </Link>
      {!user || !user.me &&
      <Link style={padding} to="/login">
        Login
      </Link>}
      {user && user.me &&
      <Link style={padding} to="/">
        Logged in as {user.me.username}
      </Link>}
      <Route path="/auth/github/callback">
        <CallBack />
      </Route>
      <Route exact path="/filelist">
        <ListView files={result.data.files}/>
      </Route>
      <Route path="/edit">
        <EditView files={result.data.files}/>
      </Route>
      <Route exact path="/login" component={LoginForm} />
    </div>
  )
}

export default App