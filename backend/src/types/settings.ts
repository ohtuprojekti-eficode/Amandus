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
}

export interface PluginSettingObject {
  name: string
  active: boolean
}
