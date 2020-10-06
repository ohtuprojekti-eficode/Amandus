import React from 'react'
import { useQuery } from '@apollo/client'
import { GITHUB_LOGIN_URL } from '../../graphql/queries'

const GitHubAuthBtn = () => {
  const loginUrl = useQuery(GITHUB_LOGIN_URL)

  const btnClickHandler = ():void => {    
    window.location.href = `${loginUrl.data.githubLoginUrl}`
  }

  if (loginUrl.error || !loginUrl) {
    return <></>
  }

  return (
    <div>
        <button 
          onClick={() => btnClickHandler()} 
          className='e-info' 
          style={{ margin: '20px', padding: '10px' }}>
            Login Via Github
        </button>
    </div>
  )
}

export default GitHubAuthBtn