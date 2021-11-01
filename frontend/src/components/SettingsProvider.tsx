import React from 'react'
//import { DEFAULT_SETTINGS } from '../constants'
import { SettingsContext } from '../context'
import { DEFAULT_SETTINGS } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import { SettingsObject } from '../types'

const SettingsProvider: React.FC = ({ children }) => {
//  const [settings, setSettings] = React.useState(DEFAULT_SETTINGS)
  
  const settings = useQuery(DEFAULT_SETTINGS)
  console.log('provider, settings', settings)
 /* 
  React.useEffect(() => {
    
    // implement functionality to fetch settings from backend here

  }, [])
*/ 

  return (
    //@ts-ignore
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
