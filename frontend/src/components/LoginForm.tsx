import React from 'react'
import { useQuery } from '@apollo/client'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GITHUB_LOGIN_URL } from '../queries'

const LoginForm = () => {

  const loginUrl = useQuery(GITHUB_LOGIN_URL)

  console.log(loginUrl)
  const btnClickHandler = ():void => {
    
    window.location.href = `${loginUrl}`
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

export default LoginForm