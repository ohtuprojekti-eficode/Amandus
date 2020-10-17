# Backend documentation

### Main technologies

* Typescript

* Node.js, GraphQL, Express 

* Docker

* ESLint

### Starting backend without frontend

##### Without docker
1. Go to `backend` folder
2. Run `yarn` to install depencies
3. Run `yarn tsc` to compile
3. Run `yarn start` and the server should launch to `localhost:3001`

##### With docker
1. Go to `backend` folder
2. Run `docker build --tag backend .` to build the backend image
3. Start the image with `docker run -p 3001:3001 backend` and the server should launch to `localhost:3001`

### GraphQL queries and mutations

* Start the development version locally and open GraphQL docs in `localhost:PORT/graphql`
