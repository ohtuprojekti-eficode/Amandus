import React, { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useHistory, useLocation } from 'react-router-dom'
import { AUTHORIZE_WITH_SERVICE, ADD_SERVICE } from '../../graphql/mutations'
import { ME } from '../../graphql/queries'
import { AuthorizeWithServiceMutationResult } from '../../types'
import useNotification from '../Notification/useNotification'

interface Props {
  service: string
}

const CallBack = ({ service }: Props) => {
  const history = useHistory()
  const location = useLocation()

  const { notify } = useNotification()

  const params = new URLSearchParams(location.search)

  const [
    authenticate,
    { loading: authenticateLoading, error: authenticateError },
  ] = useMutation<AuthorizeWithServiceMutationResult>(AUTHORIZE_WITH_SERVICE, {
    variables: { code: params.get('code'), service: service },
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
          const { __typename, ...serviceUser } =
            response.data.authorizeWithService.serviceUser
          await addService({
            variables: {
              service: serviceUser,
            },
            refetchQueries: [{ query: ME }],
          })
          const accessToken =
            response.data.authorizeWithService.tokens.accessToken
          const refreshToken =
            response.data.authorizeWithService.tokens.refreshToken
          localStorage.setItem('amandus-user-access-token', accessToken)
          localStorage.setItem('amandus-user-refresh-token', refreshToken)

          notify('Connection successful')

          history.push('/connections')
        }
      } catch (error) {
        notify('Connection failed', true)

        console.log(error)
      }
    })()
  }, [authenticate, addService, history, notify])

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
