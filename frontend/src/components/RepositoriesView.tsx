import React from 'react'
import { GET_REPO_LIST } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import { Repo } from '../types'
import {Box, List, ListItem} from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'


interface RepoProps {
  repo: Repo
}

const RepoLine = ({repo}: RepoProps) => {
  return (
    <ListItem key={repo.id} component="div" >
      <ListItem button component="a" href={repo.html_url}> 
      <ListItemText>{repo.name}</ListItemText> 

      </ListItem>
        <Link to={{ pathname: '/edit', state: { cloneUrl: repo.clone_url}}} > edit in amandus </Link>
      
    </ListItem>
  )
}
      //  <Button component={Link} to="/edit">Edit</Button>

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
    <Box>
      <List> 
      <h3>
        GitHub repos
      </h3>
      {gitHubRepos.map(
          (repo: Repo) => 
          <RepoLine key={repo.id} repo={repo}/>
        )}
        <h3>
        Bitbucket repos
      </h3>
        {bitbucketRepos.map(
          (repo: Repo) =>
          <RepoLine key={repo.id} repo={repo} />
        )}
        <h3>
        GitLab repos
      </h3>
        {gitLabRepos.map(
          (repo: Repo) => 
          <RepoLine key={repo.id} repo={repo} />
        )}
      </List>
    </Box>
  )
}
export default RepositoriesView
