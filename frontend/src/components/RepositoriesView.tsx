import React from 'react'
import { GET_REPO_LIST } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import { Repo } from '../types'

interface RepoProps {
  repo: Repo
}

const RepoLine = ({repo}: RepoProps) => {

  return (
    <div>
      <li >
          {repo.name} <a href={repo.html_url}>link</a> 
      </li>
    </div>
  )
}

const RepositoriesView = () => {

  const getRepoList= useQuery(GET_REPO_LIST)
 
  if (getRepoList.loading) {
    return (
      <p>loading...</p>
    )
  }
  if (getRepoList.error) {
    return (
      <p>error getting repos...{getRepoList.error.message}</p>
    )
  }

  const gitHubRepos = getRepoList.data.getRepoListFromService.filter((list: any) => list.service === 'github')
  const bitbucketRepos = getRepoList.data.getRepoListFromService.filter((list: any) => list.service === 'bitbucket')
  const gitLabRepos = getRepoList.data.getRepoListFromService.filter((list: any) => list.service === 'gitlab')

  return (
    <div>
      <h3>
        GitHub repos
      </h3>
      <ul>
        {gitHubRepos.map(
          (repo: Repo) => 
          <RepoLine key={repo.id} repo={repo}/>
        )}
      </ul>
      <h3>
        Bitbucket repos
      </h3>
      <ul>
        {bitbucketRepos.map(
          (repo: Repo) =>
          <RepoLine key={repo.id} repo={repo} />
        )}
      </ul>
      <h3>
        GitLab repos
      </h3>
      <ul>
        {gitLabRepos.map(
          (repo: Repo) => 
          <RepoLine key={repo.id} repo={repo} />
        )}
      </ul>
    </div> 
  )
}

export default RepositoriesView
