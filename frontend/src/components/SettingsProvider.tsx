import React, { useEffect, useState } from 'react'
import { DEFAULT_SETTINGS } from '../constants'
import { SettingsContext } from '../context'
import { useQuery } from '@apollo/client'
import { GET_SETTINGS } from '../graphql/queries'
import { SettingsObject } from '../types'

const SettingsProvider: React.FC = ({ children }) => {
  
  const { data } = useQuery(GET_SETTINGS)

  const [settings, setSettings] = useState<SettingsObject>(DEFAULT_SETTINGS)

  useEffect(() => {
    if (data?.getSettings) {
      const newSettings = { settings: {
        misc: data.getSettings.misc, 
        plugins: data.getSettings.plugins} }
      setSettings(newSettings)
    }
  }, [data])

  return (
    <SettingsContext.Provider value={{settings, setSettings}}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
