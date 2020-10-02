import React from 'react'
import { useQuery } from '@apollo/client'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GITHUB_LOGIN_URL } from '../../queries'

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
        <ButtonComponent 
          onClick={() => btnClickHandler()} 
          cssClass='e-info' 
          style={{ margin: '20px' }}>
            Login Via Github
        </ButtonComponent>
    </div>
  )
}

export default GitHubAuthBtn