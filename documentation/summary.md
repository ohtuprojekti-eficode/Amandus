# Draft: Summary documentation

## Language server

### Status

Robot Framework language server was briefly tested during sprint 0. The repository has a branch named “lang-server-test” that has a prototype for running a language server and the monaco editor together. The instructions on how to get started are in the README of that branch. 
The initial discovery was that the language server responded with some suggestions to the typed content in Monaco Editor but we had no idea how it would link to syntax highlighting. The responses were in JSON format and could be logged to console. No further investigation was done after this and no parts of the prototype were used.

### Future considerations

If the language server is to be integrated to the existing structure, we feel that it should be a separate service that is somehow connected with the current frontend. 

## Robot syntax highlighting

### Status 

Syntax highlighting for the robot framework was implemented during sprint 6 and it was heavily influenced by an existing [open-source repository](https://github.com/bolinfest/monaco-tm). The version of Monaco Editor we use is different from this example repository and requires no webpack configuration. The original Monaco Editor dependency is included for typing the functions needed in setting up the language rules. Syntax highlighting is implemented with [vscode-textmate](https://github.com/microsoft/vscode-textmate) and [vscode-oniguruma](https://github.com/microsoft/vscode-oniguruma).

* Oniguruma is a regex library and it’s loaded to our frontend in WebAssembly. The vscode-oniguruma handles all the loading of the WASM file but our frontend has to fetch it from our backend first
* Textmate requires a language configuration file in json or plist format. We got the language token rules in json format for the robot framework from the [official robocorp repository](https://github.com/robocorp/robotframework-lsp).

### Future

Adding a new syntax highlighting ruleset should be possible by composing a valid token rules file and applying it similarly. The [previously mentioned repository](https://github.com/bolinfest/monaco-tm) has a setup for python but the monaco-editor package used also contains many common languages by default. Information regarding default languages can be found [here](https://github.com/suren-atoyan/monaco-react).  

## Authentication and authorization 

### Status

At this moment, **all users have to register & login to the application in order to use the editor**. 

* When a user has logged in to the application and saves their changes, these changes will be automatically committed to a local repository on our server.
* If a user wants to push changes into a remote repository, e.g. a repository in GitHub, they have to first authorize the application with that external service. See [Authorizing with external Git services](#authorizing-with-external-git-services).

**Note**: Users are not able to clone any repositories or create repositories of their own; the application simply clones one and the same repository from GitHub for all users to use, no matter whether they have connected to GitHub or not. For discussion, see [support for multiple users](#support-for-multiple-users).

When a user logs in to the application, the following happens:

1. The given username and password are sent as parameters to backend GraphQL with mutation login.
2. Backend queries the database for a user with the given username and if a user is returned, it checks if given password matches with the one saved in the database with the `bcryptjs` library. 
2. If a user is found and the password matches, a token is created with `jsonwebtoken` library. The token is encoded with fields 
    * **id**: user's id in the database, 
    * **username**: username and 
    * **githubToken**: value undefined at this point. 
3. This token is then returned with the response to the frontend, where the token is saved to LocalStorage. 
4. The token is read from LocalStorage and added to authorization header with each request made to the backend. 
5. The backend checks for a token with each incoming request in the context. If a token is found, 
    * The database is queried for a user with the id in the decoded token. If a user is found, it is attached to context in field `currentUser`.
    * The field `githubToken`is also decoded from the token and attached to context, whether it is undefined or not. 

#### Security issues

Currently, the authorization token is stored in LocalStorage, which we recognize as a great security risk. As explained above, the token contains the user’s id, username and the GitHub authorization token if it exists. Neither the local token nor GitHub token expire, which means that **if the app token ends up in wrong hands, they could not only gain access to this application, but also potentially to the user’s GitHub account**.

For these reasons, **it is important to remove the token from LocalStorage after each session, by either logging out or manually removing the token**.

### Future considerations

For the reasons mentioned above, we see that it would be best  

* to set an expiration time for auth tokens, 
* use refresh tokens and 
* store the tokens in memory instead of LocalStorage.

## Authorizing with external Git services

### Status

As explained in the [previous section](#authentication-and-authorization), if a user wants to push changes into a remote repository, e.g. a repository in GitHub, they have to first authorize the application with that external service. 

**Note**: 
* For now, the application supports only GitHub.
* Currently, users are not able to clone any repositories or create repositories of their own; the application simply clones one and the same repository for all users to use. 

From the user's point of view, authorizing the application with an external service means that the user has to click on the **Connect GitHub** button in frontend and give our application the permission to perform operations on their behalf. After this, when the user saves their changes, those changes will be automatically committed and pushed to the remote repository as well.

More specifically, when the user authorizes the application with GitHub, the following happens

1. The user is taken to an authorization page on GitHub (`https://github.com/login/oauth/authorize`) where the user can login and give permission for our application to perform git operations.
2. If the user accepts the request, GitHub redirects to a callback url in our application (`/auth/github/callback`) with a temporary code in a code parameter. The temporary code will expire after 10 minutes.
3. Next, this temporary code will be exhanged for a GitHub access token and the GH access token will be in turn used to authorize a request to get the user's account from GitHub:
    * First, our callback component dispatches the temporary code as a parameter with `authorizeWithGithub` mutation to backend.
    * Backend requests an access token from GitHub with the temporary code and
    * With this access token, backend then requests the user account from GitHub.
4. After receiving the access token and the GitHub user account, our backend returns
    * a new token created with `jsonwebtoken`library, with the GitHub access token now included, and
    * a serviceUser object with the fields
         * **serviceName**: 'github',
         * **username**: GitHub username,
         * **email**: GitHub user email,
         * **reposurl**: GitHub user's repositories url,
5. Finally, our callback component in frontend
    * Dispatches the serviceUser to backend as parameter with `connectGitService` mutation, which will save the GitHub user data to ServiceUser table in the database.
    * Stores the new access token to LocalStorage.

See more information on [GitHub OAuth on GitHub API documentation](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps).

### Future considerations

For the security reasons mentioned above, we see that it would be best  

* to set an expiration time for all auth tokens, 
* use refresh tokens and 
* store the tokens in memory instead of LocalStorage.

## Enabling users to connect onto multiple external Git services 

### Status

Currently, a User entity in the database can relate to multiple ServiceUser entities, where a single ServiceUser contains the user account data (username, email, user id, etc.) on an external Git service such as GitHub, GitLab and BitBucket. 

However, for now the application supports only connecting to GitHub and the auth token from GitHub is added into the application’s authorization token in a way that does not allow multiple ServiceUser accounts to be simultaneously in use. 

The local auth token contains currently the following fields 

* **id**: user’s id in database, 
* **username**: user’s local username and 
* **githubToken**: GitHub authorization token.

### Future considerations

To allow users to use multiple service accounts if they wish to connect into multiple services, we suggest the tokens from external services could be included in the local token as a list of objects, i.e.

```
[
    { 
       serviceUserId: “local ServiceUser entity id here”},
       token: “GitHub authorization token string here”
    },
    { 
       serviceUserId: “local ServiceUser entity id here”},
       token: “BitBucket authorization token string here”
    },
    …..
]
```

Note: we are not yet certain how other git services like BitBucket or GitLab have enabled third party authentication and authorization, but we believe that similar information could be retrieved from all of them.

## Concept design

### Status
Version 1 of the concept design is done and covers the general feel, features and rough look we have in mind for the project. All of the concept art were made in <a href="https://www.figma.com/">Figma</a>, and future concept art and prototyping work could continue off of what has been done already. A link to the Figma document, with edit access is in the Google drive concept design folder.

### Future considerations
Future concept design work could revolve around thinking about usability and intuitiveness. Not all parts of the application have been prototyped 100%, but a good bit of the main functionality is done. This probably is part of the question of what functionality should be available aswell, and many of the menus for example are quite lackluster to allow for restructuring with new feature ideas. Although revised, discussed and polished multiple times, our versions is still v1 and for us served the purpose of feature list as well as a visual guide of what we were building. As the determined direction of the UI grows more sure, some more hi-fi prototypes could be in place.

## Deployment to production

### Status

Github actions runs all the testing and deployment. This repository has a `staging` branch and `master` acts as a production branch. Our server runs two `docker-compose` files, one for staging and one for production. Github actions builds and deploys the staging version when `staging` branch is updated. The image is tagged as `application-latest`. When the `master` branch is updated, an image tagged as `application-production` is pushed. Our dockerhub repository is [here](https://hub.docker.com/repository/docker/ohtuprojekti/wevc).

The two `docker-compose` files in our server are set to track these images with [Docker watchtower](https://github.com/containrrr/watchtower). The watchtower interval is set to 15 minutes because an unregistered docker user has a limit of 100 pulls per 6 hours. Further information regarding on what is required to setup our application can be found in the [general documentation](general.md)


### Future considerations

* The Github actions user credentials to dockerhub are in Github secrets. These will be removed after the course is over and new configuration is required to keep using the pipeline.
  * `DOCKER_REPO` is the link to our current [repository](https://hub.docker.com/repository/docker/ohtuprojekti/wevc). Maybe next users will create a new one.
  * `DOCKER_USER` should be a valid Docker user
  * `DOCKER_TOKEN` should be a valid Docker token for the user
* The watchtower tracking of new images might not be an optimal solution unless docker credentials are also setup at the server side
* Maybe more specific image tags should be built instead of just `application-latest`

## Testing

### Status

Most of the applications testing is integration testing in backend. We tested all of the important graphql mutations that handle saving a file and registering and logging in to our application. We also had some simple unit tests for functions that sanitize user inputs and define repository locations. We also have E2E-tests written in cypress that test registering and logging in to our application. 

### Future considerations

Most difficult part of testing our application is that it relies so heavily on external services. Testing things like saving file contents or connecting a github user seemed to be very hard in E2E testing because they all relied on connection to the github. Even in the integration testing we did not get proper mocking working to test the saving to remote and connecting to github. The monaco editor syntax highlighting is also completely untested because we had very little idea how it could be tested. We feel that this was somewhat acceptable for an MVP application but definitely more thinking on testing is required.

# Not in drive below this

# Future considerations for the project
This document is a running list of things that should/could be improved, added or otherwise better specified.

## App features
This section covers concrete features to be solved in code.

### Features that are to be added
- Language server
    * The groundwork(WASM) for connecting a LSP(Language Server Protocol)-server has been done, but no server has yet been setup and connected. This would handle the 2 main features regarding Robot Framework language support that we envisioned:
        * Syntax highlighting
            * This has already been implemented, although not by a language server. Our implementation entails loading RegEx syntax patterns from a PList file supplied by RoboCorp using
            <a href="https://github.com/microsoft/vscode-textmate"><underline> VSCode-Textmate</underline></a> and <a href="https://github.com/microsoft/vscode-oniguruma"><underline> VSCode-Oniguruma</underline></a>. This led us to a lot of troubles with Web Assembly and future developers should generally stay away from this in favor of a more complete solution, like a LSP.
        * Keyword suggestions
            * This seemingly needs its own LSP-server in order to get working. This hasn't been started yet, but some research has been done and it seems plausible to get working by connecting Amandus editor with <a href="https://github.com/robocorp/robotframework-lsp" ><underline>this package from RoboCorp</underline></a>.
- BitBucket & GitLab authentication
    * Github authentication is working and the user can create a service account to which he/she can connect a GitHub account.
    * How many/What services to be used is up for discussion, but BitBucket and GitLab have been in the plans. Due to them being some of the more used services besides GitHub.

### Other things to consider
- Git vs Repository service provider API
    * We have built our product to do the pulling, committing and pushing all through a <a href="#">git package for NPM</a>, but another way to handle may be to handle pushing through the different account service providers' APIs. This was the plan we had in the beginning, but later changed to only use git in order to make the code more modular and eventually usable for other things as well. This may not be the best solution though.
- Multiple concurrent user support
    * The application seems to work fine for multiple concurrent users, but the product could do with a general overhaul of the editing process (maybe with threading?) to allow for some way of more easily handling multiple concurrent users editing different files.

