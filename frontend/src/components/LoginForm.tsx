import React from 'react'
import { useQuery } from '@apollo/client'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { GITHUB_LOGIN_URL } from '../queries'

const LoginForm = () => {

  const handler = () => {
    const result = useQuery(GITHUB_LOGIN_URL)
    console.log(result)
    return result
  }

  return (
    <div>
        <ButtonComponent onClick={() => {console.log(useQuery(GITHUB_LOGIN_URL))}} cssClass='e-info' style={{ margin: '20px' }}>Login Via Github</ButtonComponent>
    </div>
  )
}

export default LoginForm