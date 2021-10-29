import React, { useState } from 'react'

import { Switch, TextField } from '@material-ui/core'
import { UserType } from '../types'
import useSettings from '../hooks/useSettings'

interface Props {
  user: UserType | undefined
}

interface pluginListObject { 
  name: string; 
  active: boolean; 
}

interface settingsListObject { 
  name: string; 
  value: boolean | number; 
  unit: string | undefined; 
}

const SettingsListObject = ({ name, value, unit }: settingsListObject ) => {
  
  const [fieldValue, setFieldValue] = useState(value)
  
  const handleFieldValueChange= () => {
    setFieldValue(value)
  }
  
  return (
    <div>
      <b>{name}</b>
      <TextField
        id={name + "-toggle"}
        name={name + "-toggle"}
        type="number"
        color="primary"
        onChange={handleFieldValueChange}
        defaultValue={fieldValue}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      {unit}
    </div>
  )
}


const PluginListObject = ({ name, active }: pluginListObject ) => {

  const [switchChecked, setSwitchChecked] = useState(active)

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
  }
  
  return (
    <div>
      <b>{name}</b>
      <Switch
        id={name + "-toggle"}
        name={name + "-toggle"}
        checked={switchChecked}
        onChange={handleSwitchToggle}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      {switchChecked ? 'on' : 'off'}
    </div>
  )
}


const PluginList = () => {
  
  const settings = useSettings().data

  return (
    <div>
      {settings.plugins.map(p => 
        <PluginListObject key={p.name} name={p.name} active={p.active} /> 
      )}
    </div>
  ) 
}

const SettingsList = () => {
  
  const settings = useSettings().data

  return (
    <div>
      <table>
        {settings.misc.map(m => 
          <SettingsListObject key={m.name} name={m.name} value={m.value} unit={m.unit} /> 
       )}
      </table>
    </div>
  )
}

const SettingsPage = ({ user }: Props) => {

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
      <h1> Admins only. </h1>

      <h2> Misc Settings </h2>
      <SettingsList /> 
      
      <h2> Plugins </h2>
      <PluginList />


      </div>
  )
}

export default SettingsPage 