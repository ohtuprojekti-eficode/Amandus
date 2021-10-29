import React from 'react'
import { DEFAULT_SETTINGS } from '../constants'
import { SettingsContext } from '../context'

const SettingsProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS)

  React.useEffect(() => {
    console.log('fetching settings')

    // implement functionality to fetch settings from backend here
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
