export interface Repo {
    id: string
    name: string
    full_name: string
    clone_url: string
    html_url: string
    service: string
}

export interface GitHubRepoListResponse {
    id: number,
    name: string,
    full_name: string,
    clone_url: string,
    html_url: string,
}

export interface BitbucketRepoListResponse {
    values: [
        {
            uuid: string,
            name: string,
            full_name: string,
            links: {
                clone: [
                    [
                        {
                            href: string
                        }
                    ]
                ],
                html: {
                    href: string
                }
            }
        }
    ]
}

export interface GitLabRepoListResponse {
    id: number,
    name: string,
    path_with_namespace: string,
    http_url_to_repo: string,
    web_url: string
}