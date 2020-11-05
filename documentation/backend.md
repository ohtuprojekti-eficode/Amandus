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

### Starting backend without frontend

1. Go to `backend` folder
2. Run `yarn` to install depencies
3. Run `yarn tsc` to compile
4. Run `yarn start` and the server should launch to `localhost:3001`

### GraphQL queries and mutations

- Start the development version locally and open GraphQL docs in `localhost:PORT/graphql`
