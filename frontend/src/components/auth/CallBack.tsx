import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { AUTHORIZE_WITH_GH } from '../../graphql/mutations'

const CallBack = () => {

  const [userdata, setUserData] = useState(null)

  const queryString = window.location.search
  const params = new URLSearchParams(queryString)

  
  const [authenticate, { loading: mutationLoading, error: mutationError }] = useMutation(AUTHORIZE_WITH_GH,
    { 
      variables: { code: params.get('code') },
    })
  
  useEffect(() => {
    if(!userdata) {
      (async () => {
        const response: any = await authenticate()
        if(response && !response.errors) {
          setUserData(response.data)
          localStorage.setItem('token', response.data.authorizeWithGithub.token)
          window.location.href = '/'
        }
      })()
    } 
  }, [userdata, authenticate])

  return (
    <div>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Please try again</p>}
      {userdata && <p>Success</p>}
    </div>
  )
}

export default CallBack