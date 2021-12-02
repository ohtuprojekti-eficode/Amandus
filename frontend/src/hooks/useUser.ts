import { useApolloClient, useQuery } from '@apollo/client'
import { ME } from '../graphql/queries'
import { MeQueryResult } from '../types'

const useUser = () => {
  const { loading, error, data: user, refetch } = useQuery<MeQueryResult>(ME)

  const { cache } = useApolloClient()

  const clearUserFromCache = () => {
    const current = cache.readQuery<MeQueryResult>({
      query: ME,
    })

    cache.writeQuery({
      query: ME,
      data: {
        ...current,
        me: null,
      },
    })
  }

  return {
    loading,
    clearUserFromCache,
    error,
    user,
    refetchUser: refetch,
  }
}

export default useUser
