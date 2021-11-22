import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { loadWASM } from 'vscode-oniguruma'

import App from './App'
import { loadVSCodeOnigurumWASM } from './utils/wasmLoader'
;(async () => {
  const data: ArrayBuffer | Response = await loadVSCodeOnigurumWASM()
  loadWASM(data)
})()

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem('amandus-user-access-token')
  const refreshToken = localStorage.getItem('amandus-user-refresh-token')

  if (!accessToken || !refreshToken) return

  return {
    headers: {
      ...headers,
      "x-access-token": accessToken,
      "x-refresh-token": refreshToken
    }
  }
})

const fetchWithTokenRefresh = async (uri: RequestInfo, options: RequestInit | undefined) => {
  const initialRequest = await fetch(uri, options)
   
  const { headers } = initialRequest
  const accessToken = headers.get("x-access-token")
  const refreshToken = headers.get("x-refresh-token")

  if (accessToken && refreshToken) {
    localStorage.setItem('amandus-user-access-token', accessToken)
    localStorage.setItem('amandus-user-refresh-token', refreshToken)
  }

  return initialRequest;
}

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/graphql'
      : '/graphql',
      fetch: fetchWithTokenRefresh
})
const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: false
  }),
  link: authLink.concat(httpLink),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
