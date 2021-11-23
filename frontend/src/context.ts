import { DEFAULT_SETTINGS } from './constants'
import React from 'react'
import { SettingsObject } from './types'

export const SettingsContext = React.createContext<{settings: SettingsObject, setSettings: (newState: SettingsObject) => void}>({settings: DEFAULT_SETTINGS, setSettings: () => ''})
