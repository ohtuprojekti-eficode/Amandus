import React from 'react'
import { useQuery } from '@apollo/client'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GITHUB_LOGIN_URL } from '../../queries'

const GitHubAuthBtn = () => {

  const loginUrl = useQuery(GITHUB_LOGIN_URL)
  console.log(loginUrl.data);
  

  const btnClickHandler = ():void => {    
    window.location.href = `${loginUrl.data.githubLoginUrl}`
    console.log(loginUrl.data.githubLoginUrl);
    
    //const user = use
  }

  if (loginUrl.error || !loginUrl) {
    return <></>
  }

  return (
    <div>
        <ButtonComponent 
          onClick={() => btnClickHandler()} 
          cssClass='e-info' 
          style={{ margin: '20px', padding: '10px' }}>
            Login Via Github
        </ButtonComponent>
    </div>
  )
}

export default GitHubAuthBtn