import { GitHubCredentials, GitHubAccessTokenResponse, GitHubUserType } from '../types/user'
import fetch from 'node-fetch'

export const requestGithubToken = (credentials:GitHubCredentials):Promise<GitHubAccessTokenResponse> =>
    fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
        },
        body: JSON.stringify(credentials)
        })
            .then<GitHubAccessTokenResponse>((res) => res.json())
            .catch((error:Error) => {
                throw new Error(error.message);
            })

export const requestGithubUserAccount = (token: string):Promise<GitHubUserType> => {

    return fetch(`https://api.github.com/user?access_token=${token}`)
    .then<GitHubUserType>((res) => res.json())
    .catch((error: Error) => {
        throw new Error(error.message);
    })
}
    

export const requestGithubUser = async (credentials:GitHubCredentials):Promise<GitHubUserType> => {
    const response = await requestGithubToken(credentials)

    if (!response || !response.access_token) {
        throw new Error('Invalid or expired code provided')
    }

    const token = response.access_token.toString()
    const githubUser = await requestGithubUserAccount(token)

    if (!githubUser) {
        throw new Error('No GitHub user account found')
    }

    return {
        ...githubUser,
        access_token: token
    }
   
}