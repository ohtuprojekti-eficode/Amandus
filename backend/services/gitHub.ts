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
                throw new Error(JSON.stringify(error));
            })

export const requestGithubUserAccount = (token: string):Promise<GitHubUserType|Error> => {

    return fetch(`https://api.github.com/user?access_token=${JSON.parse(token)}`)
    .then<GitHubUserType>((res) => res.json())
    .catch((error: Error) => {
        throw new Error(JSON.stringify(error));
    })
}
    

export const requestGithubUser = async (credentials:GitHubCredentials):Promise<GitHubUserType> => {
    const response:GitHubAccessTokenResponse = await requestGithubToken(credentials)

    const token = response.access_token
    const githubUser = await requestGithubUserAccount(JSON.stringify(token))
    
    return {
        ...githubUser,
        access_token: JSON.stringify(token) 
    }
   
}