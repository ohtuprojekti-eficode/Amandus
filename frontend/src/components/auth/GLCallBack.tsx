import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useHistory, useLocation } from 'react-router-dom'
import { AUTHORIZE_WITH_GL, ADD_SERVICE } from '../../graphql/mutations'
import { ME } from '../../graphql/queries'
import { AuthorizeWithGLMutationResult } from '../../types'

const CallBack = () => {
  const history = useHistory()
  const location = useLocation()

  const params = new URLSearchParams(location.search)

  const [
    authenticate,
    { loading: authenticateLoading, error: authenticateError },
  ] = useMutation<AuthorizeWithGLMutationResult>(AUTHORIZE_WITH_GL, {
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
        if (response.data && !response.errors) {
          const token = response.data.authorizeWithGitLab.token
          const { __typename, ...serviceUser } =
            response.data.authorizeWithGitLab.serviceUser
          await addService({
            variables: {
              service: serviceUser,
            },
            refetchQueries: [{ query: ME }],
          })
          localStorage.setItem('token', token)
          history.push('/edit')
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [authenticate, addService, history])

  return (
    <div>
      {(authenticateLoading || addServiceLoading) && <p>Loading...</p>}
      {(authenticateError || addServiceError) && (
        <p>Error :( Please try again</p>
      )}
      {addServiceData && <p>Success</p>}
    </div>
  )
}

export default CallBack
