import React from 'react'
import { DEFAULT_SETTINGS } from '../constants'
import { SettingsContext } from '../context'
import { useQuery } from '@apollo/client'
import { GET_SETTINGS } from '../graphql/queries'

const SettingsProvider: React.FC = ({ children }) => {
  
  const { data } = useQuery(GET_SETTINGS)

  const settings = data?.getSettings ?? DEFAULT_SETTINGS

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
