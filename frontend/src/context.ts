//import { DEFAULT_SETTINGS } from './constants'

import { useQuery } from '@apollo/client'
import React from 'react'
import { DEFAULT_SETTINGS } from './graphql/queries'

export const SettingsContext = () => {

    const {data: settings} = useQuery(DEFAULT_SETTINGS)
    return (
        React.createContext(settings)
    )
} 
