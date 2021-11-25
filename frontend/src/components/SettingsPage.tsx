import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { SAVE_SETTINGS } from '../graphql/mutations'
import { GET_SETTINGS } from '../graphql/queries'

import { 
  Switch, 
  TextField, 
  Button } from '@material-ui/core'

import { 
  MiscSettingObject, 
  PluginSettingObject,
  UserType } from '../types'

import useSettings from '../hooks/useSettings'
import AuthenticateDialog from './AuthenticateDialog'

interface Props {
  user: UserType | undefined
}

const MiscObject = ({ name, value, parentCallback, unit }: {
  name: string, 
  value: number, 
  unit?: string, 
  parentCallback: (name: string, value: number) => void, 
}) => {
  
  useEffect(() => {
    setFieldValue(value) 
  }, [value])
  
  const [fieldValue, setFieldValue] = useState(value)
  
  const handleFieldValueChange = (incomingValue: string) => {
    parentCallback(name, parseInt(incomingValue))
    setFieldValue(parseInt(incomingValue))
  }

  
  return (
    <div>
      <b>{name}</b>
      <TextField
        id={name + "-toggle"}
        name={name + "-toggle"}
        value={fieldValue}
        type="number"
        color="primary"
        onChange={({ target }) => handleFieldValueChange(target.value)}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      {unit}
    </div>
  )
}

const PluginObject = ({ name, active, parentCallback }: { 
  name: string, 
  active: boolean, 
  parentCallback: (name: string, value: boolean) => void, 
}) => {

  useEffect(() => {
   setSwitchChecked(active) 
  }, [active])
  
  const [switchChecked, setSwitchChecked] = useState(active)
  
  const handleSwitchToggle = () => {
    parentCallback(name, !switchChecked)
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

const SettingsPage = ({ user }: Props) => {
  
  const {settings: nestedSettings, setSettings} = useSettings()
  const settings = nestedSettings?.settings
  
  const [saved, setSaved] = useState(false)
  const [changesMade, setChangesMade] = useState(false)
  
  const [saveSettings] = useMutation(SAVE_SETTINGS)

  // Hides view from users that are not admins.
  /*
  if (user?.user_role !== 'admin') {
    return (
      <h1>
        Not Authorized
      </h1>
    )
  }
*/

  const handleSubmit = async () => {

    try {
      await saveSettings (
        { variables: { settings: settings }, update: (cache) => { 
           const updatedContent = { getSettings: settings }
           cache.writeQuery({query: GET_SETTINGS, data: updatedContent})
        }}
      )
    }
    catch (e) {
      console.log(e)
    }
    
    setSaved(true)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleCallback = ( name: string, value: boolean | number ) => {
    setChangesMade(true)
    
    switch (typeof value) {
      
      case "boolean":
        const altPlugins = settings.plugins.map(p =>
          p.name === name ? {...p, active: value} : p
        )
        setSettings({ settings: {...settings, plugins: altPlugins}})
        break;
      
      case "number":
        const altMisc = settings.misc.map(m =>
          m.name === name ? {...m, value: value} : m
        )
        setSettings({ settings: {...settings, misc: altMisc}})
        break;
        
    }
  }

  if (!settings) {
    return (
      <div>
        loading...
      </div>
    )
  }

  
    return (
    <div>
      <div>        
        <AuthenticateDialog open={!user} />
      </div>
      <h1> Admins only. </h1>

      {settings.misc.map((m: MiscSettingObject) => 
        <MiscObject 
          key={m.name} 
          name={m.name} 
          value={m.value} 
          unit={m.unit} 
          parentCallback={handleCallback}
        /> 
       )}

      {settings.plugins.map((p: PluginSettingObject) => 
        <PluginObject 
          key={p.name} 
          name={p.name} 
          active={p.active} 
          parentCallback={handleCallback}
        /> 
      )}
      
      <Button 
        onClick={handleSubmit}
        id="save-settings-button"
        name="save-settings-button"
        variant="contained" 
        color="primary"
        >
          Save settings
      </Button>
      <p>
        {changesMade ? 'Settings changed. Please save.': ''}
      </p>
      <p>
        {saved ? 'Saved successfully. Refreshing page...': ''}
      </p> 
      
      
      </div>
  )
}

export default SettingsPage 