import React, { useState } from 'react'

import { Switch, TextField, Button } from '@material-ui/core'
import { UserType } from '../types'
import useSettings from '../hooks/useSettings'

interface Props {
  user: UserType | undefined
}

interface pluginObject { 
  name: string; 
  active: boolean; 
}

interface settingsObject { 
  name: string; 
  value: boolean | number; 
  unit: string | undefined; 
}


const PluginObject = ({ name, active }: pluginObject ) => {

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

const SettingsObject = ({ name, value, unit }: settingsObject ) => {
  
  const [fieldValue, setFieldValue] = useState(value)
  
  const handleFieldValueChange = () => {
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

// @ts-ignore
const SettingsList = ({ settings }) => {
  
  return (
    <div>

      {settings.misc.map((m: settingsObject) => 
        <SettingsObject 
          key={m.name} 
          name={m.name} 
          value={m.value} 
          unit={m.unit} 
        /> 
       )}

      {settings.plugins.map((p: pluginObject) => 
        <PluginObject 
          key={p.name} 
          name={p.name} 
          active={p.active} 
        /> 
      )}

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

  const handleSave = () => {
    console.log('aaa')
//  const [saveSettings] = useMutation(SAVE_SETTINGS)
  }


  const settings = useSettings()
  console.log('spage, settings', settings)


  return (
    <div >
      <h1> Admins only. </h1>

      <SettingsList settings={settings}/> 
      
      <Button 
        id="save-settings-button"
        name="save-settings-button"
        variant="contained" 
        onClick={handleSave}
        color="primary"
        >
          Save settings
      </Button>
      
      </div>
  )
}

export default SettingsPage 