# Backend documentation

### Main technologies

- Typescript

- Node.js, GraphQL, Express

- Docker

- ESLint

### Environment values

- `DB_URI` = PostgreSQL url, **not required**
- `PORT` = defaults to 3001, **not required**
- `JWT_SECRET` = defaults to `changeme`, **not required**
- `GH_CLIENT_ID` = Client ID of GitHub App, **required**
- `GH_CLIENT_SECRET` = Client secret of GitHub App, **required**
- `GH_CB_URL` = GitHub App login callback url, defaults to `http://localhost:3000/auth/github/callback`, **not required for local dev**
- `POSTGRES_PORT` = Postgres port for connecting
- `POSTGRES_USER` = Postgres username for connecting
- `POSTGRES_HOST` = Postgres hostname for connecting
- `POSTGRES_DB` = Postgres database name for connecting
- `POSTGRES_PASSWORD` = Postgres database password for connecting

### Starting backend without frontend

##### Without docker

1. Go to `backend` folder
2. Run `yarn` to install depencies
3. Run `yarn tsc` to compile
4. Run `yarn start` and the server should launch to `localhost:3001`

##### With docker

1. Go to `backend` folder
2. Run `docker build --tag backend .` to build the backend image
3. Start the image with `docker run -p 3001:3001 backend` and the server should launch to `localhost:3001`

### GraphQL queries and mutations

- Start the development version locally and open GraphQL docs in `localhost:PORT/graphql`
