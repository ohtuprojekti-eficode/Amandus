import React from 'react'
import { GET_REPO_LIST } from '../graphql/queries'
import { useQuery } from '@apollo/client'



const RepositoriesView = () => {

  const getRepoList= useQuery(GET_REPO_LIST)
 
  if (getRepoList.loading) {
    return (
      <p>loading...</p>
    )
  }
  return (
    <div>
      <h3>
        Github repos
      </h3>
      <ol>
        {getRepoList.data.getRepoListFromService.map(
          (name:String,i:number) => 
          <li key={i}>
            {name}
          </li>
        )}
      </ol>
    </div> 
  )
}

export default RepositoriesView
