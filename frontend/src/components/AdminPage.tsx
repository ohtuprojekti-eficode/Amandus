import React, { useState } from 'react'

import { Switch } from '@material-ui/core'
import { UserType } from '../types'

interface Props {
  user: UserType | undefined
}

const AdminPage = ({ user }: Props) => {

  const [switchChecked, setSwitchChecked] = useState(false)

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
  }

// Hides view from users that are not admins

  if (user?.user_role !== 'admin') {
    return (
      <h1>
        Not Authorized
      </h1>
    )
  }


  
  const pluginList = () => {
    return (
      <div>
        <Switch
          id="robot-language-server-toggle"
          name="robot-language-server-toggle"
          checked={switchChecked}
          onChange={handleSwitchToggle}
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        {switchChecked ? 'checked' : 'not checked'}
      </div>
    ) 
  }

  return (
    <div >
      <h1>
        Admins only. For plugin management. 
      </h1>
      
      {pluginList()}

      </div>
  )
}

export default AdminPage 