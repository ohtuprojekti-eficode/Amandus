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



// @ts-ignore
const MiscObject = (props) => {

  const [fieldValue, setFieldValue] = useState(props.value)

  useEffect(() => {
   setFieldValue(props.value) 
  }, [props.value])

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
        value={fieldValue}
        type="number"
        color="primary"
        onChange={({ target }) => handleFieldValueChange(target.value)}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      {props.unit}
    </div>
  )
}

// @ts-ignore
const PluginObject = (props) => {

  const [switchChecked, setSwitchChecked] = useState(props.active)
  
  useEffect(() => {
   setSwitchChecked(props.active) 
  }, [props.active])
  
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
  const [saved, setSaved] = useState(false)


  const {settings: nestedSettings, setSettings} = useSettings()
  const settings = nestedSettings?.settings
  
  const [saveSettings] = useMutation(SAVE_SETTINGS, {
  })
 
  // @ts-ignore
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const vars = { variables: { settings: settings }}
      console.log('vars', vars)
      await saveSettings (
        { variables: { settings: settings }, update: (cache) => { 
           const currentContent = cache.readQuery({ query: GET_SETTINGS})
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
    }, 700)

  }

// @ts-ignore
  const handleCallback = ({ name, value }: { name: string, value: number | boolean }) => {
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
      <h1> Admins only. </h1>

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
        onClick={handleSubmit}
        id="save-settings-button"
        name="save-settings-button"
        variant="contained" 
        color="primary"
        >
          Save settings
      </Button>
      <p>
        {saved ? 'Saved successfully. Refreshing page...': ''}
      </p> 
      
      
      </div>
  )
}

export default SettingsPage 