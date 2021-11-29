/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApolloError } from 'apollo-server'
import { SETTINGS } from '../constants'
import { SettingsObject, MiscSettingObject, PluginSettingObject } from '../types/settings'
import { writeFileSync } from 'fs'

const typeDef = `
    type Settings {
      misc: [MiscSetting]
      plugins: [PluginSetting]
    }
    input Sinput {
      misc: [Minput]
      plugins: [Pinput]
    }
    type MiscSetting {
      name: String!
      value: Int!
      unit: String
      active: Boolean
    }
    type PluginSetting {
      name: String!
      active: Boolean!
    }
    input Minput {
      name: String!
      value: Int!
      unit: String!
      active: Boolean
    }
    input Pinput {
      name: String!
      active: Boolean!
    }
`


const resolvers = {
  Settings: {
    misc: (root: SettingsObject): MiscSettingObject[] => root.settings.misc,
    plugins: (root: SettingsObject): PluginSettingObject[] => root.settings.plugins
  },

  Query: {
    getSettings: (
      _root: unknown,
    ): SettingsObject => {
      return <SettingsObject>SETTINGS
    },
  },


  Mutation: {
    saveSettings: (
      _root: unknown,
      settings: SettingsObject
    ): string => {

      try {
        writeFileSync('src/utils/settings.json', JSON.stringify(settings, null, 4))
      } catch (error) {
        throw new ApolloError('Could not save settings')
      }
      return 'Saved!'

    },
  },
}


export default {
  resolvers,
  typeDef,
}
