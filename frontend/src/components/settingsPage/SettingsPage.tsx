import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SAVE_SETTINGS } from '../../graphql/mutations'
import { GET_SETTINGS } from '../../graphql/queries'
import { MiscObject } from './MiscObject'
import { PluginObject } from './PluginObject'

import {
  Button
} from '@material-ui/core'

import {
  MiscSettingObject,
  PluginSettingObject,
  UserType
} from '../../types'

import useSettings from '../../hooks/useSettings'
import AuthenticateDialog from '../AuthenticateDialog'

interface Props {
  user: UserType | undefined
}

const valueIsWithinRange = (value: number, min?: number, max?: number): boolean => {
  if (min && value < min) {
    return false
  }

  if (max && value > max) {
    return false
  }

  return true
}

export const SettingsPage = ({ user }: Props) => {
  
  const { settings: nestedSettings, setSettings } = useSettings()
  const settings = nestedSettings?.settings
  
  const [saved, setSaved] = useState(false)
  const [changesMade, setChangesMade] = useState(false)
  const [flag, setFlag] = useState(false)

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
      await saveSettings(
        {
          variables: { settings: settings }, update: (cache) => {
            const updatedContent = { getSettings: settings }
            cache.writeQuery({ query: GET_SETTINGS, data: updatedContent })
          }
        }
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

  const handleCallback = (name: string, value: boolean | number, min?: number, max?: number) => {
    setChangesMade(true)

    switch (typeof value) {

      case "boolean":
        if (settings.plugins.find(p => p.name === name)) {
          const altPlugins = settings.plugins.map(p =>
            p.name === name ? { ...p, active: value } : p
          )
          setSettings({ settings: { ...settings, plugins: altPlugins } })
        } else {
          const altMisc = settings.misc.map(m =>
            m.name === name ? { ...m, active: value } : m
          )
          setSettings({ settings: { ...settings, misc: altMisc } })
        }
        break;

      case "number":
        setFlag(!valueIsWithinRange(value, min, max))
        const altMisc = settings.misc.map(m =>
          m.name === name ? { ...m, value: value } : m
        )
        setSettings({ settings: { ...settings, misc: altMisc } })
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
          min={m.min}
          max={m.max}
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
        disabled={flag}
      >
        Save settings
      </Button>
      <p>
        {flag ? 'Invalid input value.' : '' } 
      </p>
      <p>
        {changesMade && !flag ? 'Settings changed. Please save.' : ''}
      </p>
      <p>
        {saved ? 'Saved successfully. Refreshing page...' : ''}
      </p>


    </div>
  )
}

export default SettingsPage