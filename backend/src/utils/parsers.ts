import {
  Repository,
  GitHubRepository,
  BitbucketRepositories,
  GitLabRepository,
  ServiceRepository
} from '../types/repository'

export const parseServiceRepositories = (response: ServiceRepository[] | ServiceRepository, service: string): Repository[] => {
  if (service === 'github') {
    return parseGithubRepositories(response as GitHubRepository[])
  } else if (service === 'gitlab') {
    return parseGitlabRepositories(response as GitLabRepository[])
  } else if (service === 'bitbucket') {
    return parseBitbucketRepositories(response as BitbucketRepositories)
  }

  return []
}

export const parseGithubRepositories = (response: GitHubRepository[]): Repository[] => {
  const repolist = response.map((repo: GitHubRepository) => {
    const repoId = `${repo.id}`

    const repoObject: Repository = {
      id: repoId,
      name: repo.name,
      full_name: repo.full_name,
      clone_url: repo.clone_url,
      html_url: repo.html_url,
      service: 'github'
    }

    return repoObject
  }
  )

  return repolist
}

export const parseBitbucketRepositories = (response: BitbucketRepositories): Repository[] => {
  const repolist = response.values.map(repo => {
    const clone_url = repo.links.clone.find(url => url.name === 'https')
    if (!clone_url) {
      throw Error('No clone url found, cannot append repo to list')
    }

    const repoObject: Repository = {
      id: repo.uuid,
      name: repo.name,
      full_name: repo.full_name,
      clone_url: clone_url.href,
      html_url: repo.links.html.href,
      service: 'bitbucket'
    }
    return repoObject
  })

  return repolist
}

export const parseGitlabRepositories = (response: GitLabRepository[]): Repository[] => {
  const repolist = response.map((repo: GitLabRepository) => {
    const repoId = `${repo.id}`

    const repoObject: Repository = {
      id: repoId,
      name: repo.name,
      full_name: repo.path_with_namespace,
      clone_url: repo.http_url_to_repo,
      html_url: repo.web_url,
      service: 'gitlab',
    }

    return repoObject
  })

  return repolist
}
