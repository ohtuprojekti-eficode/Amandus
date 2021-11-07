import { RequestInfo, RequestInit, Response } from 'node-fetch'

const toFetchResponse = (object: Record<string, unknown>) =>
  Promise.resolve(new Response(JSON.stringify(object)))

const nodeFetchMock = (url: RequestInfo, _init?: RequestInit | undefined): Promise<Response> => {
  switch (url) {
    case 'https://github.com/login/oauth/access_token':
    case 'https://gitlab.com/oauth/token':
    case 'https://bitbucket.org/site/oauth2/access_token':
      return toFetchResponse({
        access_token: "immatokenlol",
        refresh_token: "immarefreshtokenlol"
      })

    case 'https://api.github.com/user':
      return toFetchResponse(
        {
          login: 'elvis',
          email: 'elvis@detroit.us',
          repos_url: 'https://api.github.com/elvis/repos'
        }
      )

    case 'https://gitlab.com/api/v4/user':
      return toFetchResponse(
        {
          username: 'elvis',
          email: 'elvis@detroit.us'
        }
      )

    case 'https://api.bitbucket.org/2.0/user':
      return toFetchResponse(
        {
          username: 'elvis',
          links: {
            repositories: {
              href: 'https://api.bitbucket.org/2.0/repositories/elvis'
            }
          }
        }
      )

    case 'https://api.bitbucket.org/2.0/user/emails':
      return toFetchResponse({
        values:
          [
            {
              is_primary: true,
              email: 'elvis@detroit.us'
            }
          ]
      })

    default:
      throw new Error(`Url "${url.toString()}"" is not defined in mocked node_fetch`)
  }
}

nodeFetchMock.isRedirect = (_code: number): boolean => {
  return false
}

export default nodeFetchMock
