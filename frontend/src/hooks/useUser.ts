import { useQuery } from '@apollo/client'
import { ME } from '../graphql/queries'
import { MeQueryResult } from '../types'

const useUser = () => {
  const { loading, error, data: user } = useQuery<MeQueryResult>(ME)

  return { loading, error, user }
}

export default useUser
