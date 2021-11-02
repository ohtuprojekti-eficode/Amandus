/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import { ForbiddenError, ApolloError, gql } from 'apollo-server'
import { SETTINGS } from '../constants'
import { SettingsObject } from '../types/settings'

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

  /*
  Mutation: {
    saveChanges: async (
      _root: unknown,
      saveArgs: SaveArgs,
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      try {
        await saveChanges(saveArgs, context)
      } catch (error) {
        if (error.message === 'Merge conflict') {
          throw new ApolloError('Merge conflict detected')
        } else {
          throw new ApolloError(error.message)
        }
      }

      return 'Saved'
    },
  },
  */
}

export default {
  resolvers,
  typeDef,
}
