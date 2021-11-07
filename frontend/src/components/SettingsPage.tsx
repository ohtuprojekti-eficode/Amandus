import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SAVE_SETTINGS } from '../graphql/mutations'

import { 
  Switch, 
  TextField, 
  Button } from '@material-ui/core'

import { 
  MiscSettingObject, 
  PluginSettingObject,
  UserType } from '../types'

import useSettings from '../hooks/useSettings'
import { GET_SETTINGS } from '../graphql/queries'

interface Props {
  user: UserType | undefined
}



// @ts-ignore
const MiscObject = (props) => {
  
  const [fieldValue, setFieldValue] = useState(props.value)
 // @ts-ignore 
  const handleFieldValueChange = (incomingValue) => {
// @ts-ignore
    props.parentCallback({ "name": props.name, "value": parseInt(incomingValue) })
    setFieldValue(incomingValue)
  }
  
  return (
    <div>
      <b>{props.name}</b>
      <TextField
        id={props.name + "-toggle"}
        name={props.name + "-toggle"}
        type="number"
        color="primary"
        onChange={({ target }) => handleFieldValueChange(target.value)}
        defaultValue={fieldValue}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      {props.unit}
    </div>
  )
}

// @ts-ignore
const PluginObject = (props) => {

  const [switchChecked, setSwitchChecked] = useState(props.active)

  const handleSwitchToggle = () => {
    setSwitchChecked(!switchChecked)
    props.parentCallback({ "name": props.name, "value": !switchChecked })
  }
  
  return (
    <div>
      <b>{props.name}</b>
      <Switch
        id={props.name + "-toggle"}
        name={props.name + "-toggle"}
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

  const [settings, setSettings] = useState(useSettings())
  
  const [saveSettings] = useMutation(SAVE_SETTINGS, {
    refetchQueries: [ { query: GET_SETTINGS }]
  })
 
  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault()

    const stringSettings = JSON.stringify(settings)

    try {
      await saveSettings ({
        variables: { settings: settings }
      })
    }
    catch (e) {
      console.log(e)
    }

  }

// @ts-ignore
  const handleCallback = ({ name, value }: { name: string, value: number | boolean }) => {
    switch (typeof value) {
      
      case "boolean":
        const altPlugins = settings.plugins.map(p =>
          p.name === name ? {...p, active: value} : p
        )
        setSettings({...settings, plugins: altPlugins})
        break;
      
      case "number":
        const altMisc = settings.misc.map(m =>
          m.name === name ? {...m, value: value} : m
        )
        setSettings({...settings, misc: altMisc})
        break;

    }
  }

  
    return (
    <div >
      <h1> Admins only. </h1>

      <form onSubmit={handleSubmit}>

      {settings.misc.map((m: MiscSettingObject) => 
      // @ts-ignore
        <MiscObject 
          key={m.name} 
          name={m.name} 
          value={m.value} 
          unit={m.unit} 
          parentCallback={handleCallback}
        /> 
       )}

      {settings.plugins.map((p: PluginSettingObject) => 
      // @ts-ignore
        <PluginObject 
          key={p.name} 
          name={p.name} 
          active={p.active} 
          parentCallback={handleCallback}
        /> 
      )}
      
      <Button 
        type="submit"
        id="save-settings-button"
        name="save-settings-button"
        variant="contained" 
        color="primary"
        >
          Save settings
      </Button>
      
      </form>
      
      </div>
  )
}

export default SettingsPage 