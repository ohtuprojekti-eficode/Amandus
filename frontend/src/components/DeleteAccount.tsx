import React from 'react'
import { useMutation } from '@apollo/client'

import { Button } from '@material-ui/core'
import { DELETE_USER } from '../graphql/mutations'
import { UserType } from '../types'

interface Props {
  user: UserType | undefined
}

const DeleteAccount = ({ user }: Props) => {
  
  const [deleteUser] = useMutation(DELETE_USER)

  const deleteUserAccount = async () => {
    try {
      await deleteUser({
        variables: {
          username: user?.username
        }
      })

      localStorage.clear()
      window.location.href = '/'

    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <div >
      
        <p >
          We are sorry to see you go...
        </p>

        <Button
          id="delete-button"
          name="delete-button"
          color="primary"
          variant="contained"
          onClick={deleteUserAccount}
        >
          Delete Account
        </Button>
        
      </div>
  )
}

export default DeleteAccount