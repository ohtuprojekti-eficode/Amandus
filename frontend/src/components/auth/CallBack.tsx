import React, { useEffect } from 'react'
// import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
// import { AUTHORIZE_WITH_GH, ADD_SERVICE } from '../../graphql/mutations'
import { AUTHORIZE_WITH_GH } from '../../graphql/mutations'

const CallBack = () => {
  // const [servicedata, setServiceData] = useState(null)

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)

  const [
    authenticate,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(AUTHORIZE_WITH_GH, {
    variables: { code: params.get('code') },
  })

  // const [addService, { data: addServiceData,error: addServiceError }] = useMutation(ADD_SERVICE)

  // flow
  // 1. do the AUTHORIZE_WITH_GH mutation => returns service = {serviceName, username, email, reposurl} and token
  // 2. call ADD_SERVICE mutation to add the service to current user
  // 3. set localstorage token to token from AUTHORIZE_WITH_GH (contains local user id, username and githubtoken)

  // also somehow disable github button when current user is not logged in locally

  useEffect(() => {
    ;(async () => {
      try {
        const response: any = await authenticate()
        if (response && !response.errors) {
          localStorage.setItem('token', response.data.authorizeWithGithub.token)

          window.location.href = '/'
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [authenticate])

  return (
    <div>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Please try again</p>}
      {/* {SOME ADD SERVICE SUCCESS MESSAGE -> <p>Success</p>} */}
    </div>
  )
}

export default CallBack
