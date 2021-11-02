import React, { useState } from 'react'

import { 
  Switch, 
  TextField, 
  Button } from '@material-ui/core'

import { 
  SettingsObject, 
  MiscSettingObject, 
  PluginSettingObject,
  UserType } from '../types'

import useSettings from '../hooks/useSettings'

interface Props {
  user: UserType | undefined
}

const MiscObject = ({ name, value, unit }: MiscSettingObject) => {
  
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

const PluginObject = ({ name, active }: PluginSettingObject) => {

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

/* A deconstructured version of SettingsList props. All this to avoid the word 'settings' twice and importing the settingsobject interface. May be useful if more setting types emerge. 
const SettingsList = ({ 
  settings: { 
    misc,
    plugins
  } }: { 
    settings: { 
      misc: MiscSettingObject[],
      plugins: PluginSettingObject[] 
    }
}) => { 
*/

const SettingsList = ({settings}: SettingsObject ) => { 

  return (
    <div>

      {settings.misc.map((m: MiscSettingObject) => 
        <MiscObject 
          key={m.name} 
          name={m.name} 
          value={m.value} 
          unit={m.unit} 
        /> 
       )}

      {settings.plugins.map((p: PluginSettingObject) => 
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

  const settings = useSettings()
  
  const handleSave = () => {
    //  const [saveSettings] = useMutation(SAVE_SETTINGS)
  }


  return (
    <div >
      <h1> Admins only. </h1>

      <SettingsList settings={settings} /> 
      
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