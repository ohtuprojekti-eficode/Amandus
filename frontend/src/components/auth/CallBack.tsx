import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { AUTHORIZE_WITH_GH, ADD_SERVICE } from '../../graphql/mutations'

const CallBack = () => {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)

  const [
    authenticate,
    { loading: authenticateLoading, error: authetincateError },
  ] = useMutation(AUTHORIZE_WITH_GH, {
    variables: { code: params.get('code') },
  })

  const [
    addService,
    {
      data: addServiceData,
      loading: addServiceLoading,
      error: addServiceError,
    },
  ] = useMutation(ADD_SERVICE)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await authenticate()
        if (response && !response.errors) {
          const token = response.data.authorizeWithGithub.token
          const {
            __typename,
            ...serviceUser
          } = response.data.authorizeWithGithub.serviceUser
          await addService({
            variables: {
              service: serviceUser,
            },
          })
          localStorage.setItem('token', token)

          window.location.href = '/'
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [authenticate, addService])

  return (
    <div>
      {(authenticateLoading || addServiceLoading) && <p>Loading...</p>}
      {(authetincateError || addServiceError) && (
        <p>Error :( Please try again</p>
      )}
      {addServiceData && <p>Success</p>}
    </div>
  )
}

export default CallBack
