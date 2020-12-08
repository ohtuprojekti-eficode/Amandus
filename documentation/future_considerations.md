# Draft: Summary documentation

## Language server

### Status

Robot framework language server was briefly tested during sprint 0. The repository has a branch named “lang-server-test” that has a prototype for running a language server and the monaco editor together. The instructions on how to get started are in the README of that branch. 
The initial discovery was that the language server responded with some suggestions to the typed content in Monaco Editor but we had no idea how it would link to syntax highlighting. The responses were in JSON format and could be logged to console. No further investigation was done after this and no parts of the prototype were used.

### Future considerations

If the language server is to be integrated to the existing structure, we feel that it should be a separate service that is somehow connected with the current frontend. 

## 


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
    * Github authentication is working and the user can create a service account to which he/she can connect a Github-account.
    * How many/What services to be used is up for discussion, but BitBucket and GitLab have been in the plans. Due to them being some of the more used services besides GitHub.

### Other things to consider
- Git vs Repository service provider API
    * We have built our product to do the pulling, committing and pushing all through a <a href="#">git package for NPM</a>, but another way to handle may be to handle pushing through the different account service providers' APIs. This was the plan we had in the beginning, but later changed to only use git in order to make the code more modular and eventually usable for other things aswell. This may not be the best solution though.
- Multiple concurrent user support
    * The application seems to work fine for multiple concurrent users, but the product could do with a general overhaul of the editing process(maybe with threading?) to allow for some way of more easily handling multiple concurrent users editing different files.


## Concept design
Version 1 of the concept design is done and covers the general feel, features and rough look we have in mind for the project. These are in no way final and much can be improved in further development of this product. All of the concept art were made in <a href="https://www.figma.com/">Figma</a>.
