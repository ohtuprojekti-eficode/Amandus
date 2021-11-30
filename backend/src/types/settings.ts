export interface SettingsObject {
  settings: {
    misc: MiscSettingObject[];
    plugins: PluginSettingObject[];
  }
}

export interface MiscSettingObject {
  name: string
  value: number
  unit: string
  min?: number
  max?: number
}

export interface PluginSettingObject {
  name: string
  active: boolean
}
