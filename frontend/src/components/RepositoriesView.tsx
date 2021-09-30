import React from 'react'
import { GET_REPO_LIST } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import { Repo } from '../types'



const RepositoriesView = () => {

  const getRepoList= useQuery(GET_REPO_LIST)
 
  if (getRepoList.loading) {
    return (
      <p>loading...</p>
    )
  }
  if (getRepoList.error) {
    return (
      <p>error getting repos...</p>
    )
  }
  return (
    <div>
      <h3>
        Github repos
      </h3>
      <ul>
        {getRepoList.data.getRepoListFromService.map(
          (repo: Repo, i:number) => 
          <li key={i}>
            {repo.name}
          </li>
        )}
      </ul>
    </div> 
  )
}

export default RepositoriesView
