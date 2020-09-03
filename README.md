# WEVC

## Documentation
[Backlog](https://docs.google.com/spreadsheets/d/1YDC3QcxFgtNw_KvYTQlDE8rA0DA7rvMYv_ZlsHXdvww)

### Definition of done
* Feature is implemented
* Tests are passed
* Code is reviewed

### How to run prototype

* Requirements: `nodejs`, `npm` and `yarn`
* Go to `prototype`-folder
* Run `./launch.sh` to run a script that:
  * Builds/installs `monaco language client`, `jsonrpc-ws-proxy` and `robot framework language server`
  * Starts language server at port 3000 and Monaco client at port 4200
* Go to `localhost:4200` with your browser to view the monaco editor with the language server attached
