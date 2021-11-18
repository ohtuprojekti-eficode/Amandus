import { RequestInfo, RequestInit, Response } from 'node-fetch'

const toFetchResponse = (object: Record<string, unknown> | Record<string, unknown>[]) =>
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
    case 'https://api.github.com/user/repos':
      return toFetchResponse([
        {
          id: 123,
          name: 'ghtestrepo1',
          full_name: 'elvis/ghtestrepo1',
          clone_url: 'https://github.com/elvis/ghtestrepo1.git',
          html_url: 'https://github.com/elvis/ghtestrepo1.git',
        },
        {
          id: 123123,
          name: 'ghtestrepo2',
          full_name: 'elvis/ghtestrepo2',
          clone_url: 'https://github.com/elvis/ghtestrepo2.git',
          html_url: 'https://github.com/elvis/ghtestrepo2.git',
        },
      ])

    case 'https://gitlab.com/api/v4/projects?simple=true&min_access_level=30':
      return toFetchResponse([
        {
          id: '321',
          name: 'gltestrepo1',
          path_with_namespace: 'elvis/gltestrepo1',
          http_url_to_repo: 'https://gitlab.com/elvis/gltestrepo1.git',
          web_url: 'https://gitlab.com/elvis/gltestrepo1.git'
        },
        {
          id: '321321',
          name: 'gltestrepo2',
          path_with_namespace: 'elvis/gltestrepo2',
          http_url_to_repo: 'https://gitlab.com/elvis/gltestrepo2.git',
          web_url: 'https://gitlab.com/elvis/gltestrepo2.git'
        },
      ])

    case 'https://api.bitbucket.org/2.0/repositories/elvis':
      return toFetchResponse({
        values: [
          {
            uuid: 'asdasdad',
            name: 'bbtestrepo1',
            full_name: 'elvis/bbtestrepo1',
            links: {
              html: {
                href: 'https://bitbucket.org/elvis/bbtestrepo1'
              },
              clone:
                [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/elvis/bbtestrepo1.git',
                  }
                ]
            },
          },
          {
            uuid: 'asdasdadasd',
            name: 'bbtestrepo2',
            full_name: 'elvis/bbtestrepo2',
            links: {
              html: {
                href: 'https://bitbucket.org/elvis/bbtestrepo2'
              },
              clone:
                [
                  {
                    name: 'https',
                    href: 'https://bitbucket.org/elvis/bbtestrepo2.git',
                  }
                ]
            },
          },
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
