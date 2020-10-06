import React from 'react'
// import { useQuery } from '@apollo/client'

const CallBack = () => {

  const queryString = window.location.search
  const params = new URLSearchParams(queryString);

  return (
    <div>
        {JSON.stringify(params.get('code'))}
    </div>
  )
}

export default CallBack