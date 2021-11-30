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

interface Props {
  user: UserType | undefined
}

const MiscObject = ({ name, value, parentCallback, unit, active }: {
  name: string, 
  value: number, 
  unit?: string, 
  active?: boolean
  parentCallback: (name: string, value: number | boolean) => void, 
}) => {
  
  useEffect(() => {
    setFieldValue(value) 
    setSwitchChecked(active) 
  }, [value, active])

  const [fieldValue, setFieldValue] = useState(value)
  
  const [switchChecked, setSwitchChecked] = useState(active)
  
  const handleFieldValueChange = (incomingValue: string) => {
    parentCallback(name, parseInt(incomingValue))
    setFieldValue(parseInt(incomingValue))
  }

  const handleSwitchToggle = () => {
    parentCallback(name, !switchChecked)
    setSwitchChecked(!switchChecked)
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
        disabled={!switchChecked}
        />
      {unit}
      <Switch
        id={name + "-toggle"}
        name={name + "-toggle"}
        checked={switchChecked}
        onChange={handleSwitchToggle}
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
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
    console.log(value)

    const altPlugins = settings.plugins.map(p =>
        p.name === name ? {...p, active: value} : p
      )
    
    setSettings({ settings: {...settings, plugins: altPlugins as PluginSettingObject[]}})

    const altMiscs = settings.misc.map(m => 
      m.name === name ? 
        typeof value == "boolean" ? {...m, active: value} : {...m, value: value} 
      : m
    )

    setSettings({ settings: {...settings, misc: altMiscs}})

    console.log(settings)
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
      <h1> Admins only. </h1>

      {settings.misc.map((m: MiscSettingObject) => 
        <MiscObject 
          key={m.name} 
          name={m.name} 
          value={m.value} 
          unit={m.unit} 
          active={m.active}
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