/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApolloError } from 'apollo-server'
import { SETTINGS } from '../constants'
import { SettingsObject } from '../types/settings'
import { writeFileSync } from 'fs'

const typeDef = `
    type Settings {
        misc: [MiscSetting]
        plugins: [PluginSetting]
    }
    type MiscSetting {
      name: String!
      value: Int!
      unit: String!
    }
    type PluginSetting {
      name: String!
      active: Boolean!
    }
`

const resolvers = {
  Query: {
    getSettings: (
      _root: unknown,
    ): SettingsObject => {
      return <SettingsObject> SETTINGS.content
    },
  },

  
  Mutation: {
    saveSettings: (
      _root: unknown,
      input: string 
    ): string => {
      try {
        writeFileSync('src/utils/settings.json', JSON.stringify( { input }, null, 2) )
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
