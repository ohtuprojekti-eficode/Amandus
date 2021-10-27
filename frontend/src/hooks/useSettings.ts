import { SettingsContext } from './../context'
import React from 'react'

/**
 * Hook that returns the app wide settings object
 * @returns settings object
 */
const useSettings = () => React.useContext(SettingsContext)

export default useSettings
