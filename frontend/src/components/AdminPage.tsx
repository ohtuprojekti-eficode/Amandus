import React, { useState } from 'react'

import { Switch } from '@material-ui/core'
import { UserType } from '../types'

interface Props {
  user: UserType | undefined
}

interface pluginObject { 
  name: string; 
  data: string; 
}

const PluginObject = ({ name, data }: pluginObject ) => {

  const [switchChecked, setSwitchChecked] = useState(false)

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
  }
  
  return (
    <div>
      <b>{name}</b>
      <Switch
        id="robot-language-server-toggle"
        name="robot-language-server-toggle"
        checked={switchChecked}
        onChange={handleSwitchToggle}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      {switchChecked ? 'on' : 'off'}
    </div>
  )
}

const pluginList = () => {

  const plugins: pluginObject[] = [
    { name: '1. plugin', data: 'data1' },
    { name: '2. plugin', data: 'data2' },
    { name: '3. plugin', data: 'data3' },
  ]

  //  console.log(plugins)

  return (
    <div>
      {plugins.map(p => 
        <PluginObject name={p.name} data={p.data} /> 
      )}
    </div>
  ) 
}

const AdminPage = ({ user }: Props) => {

// Hides view from users that are not admins. Uncomment after this page is fully implemented
/*
  if (user?.user_role !== 'admin') {
    return (
      <h1>
        Not Authorized
      </h1>
    )
  }
*/

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