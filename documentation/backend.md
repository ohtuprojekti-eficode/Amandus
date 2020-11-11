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
- `DATABASE_URL` = Postgresql connection URL, **not required for local dev with docker**

### Starting backend without frontend

1. Go to `backend` folder
2. Run `yarn` to install depencies
3. Run `yarn tsc` to compile
4. Run `yarn start` and the server should launch to `localhost:3001`

### GraphQL queries and mutations

- Start the development version locally and open GraphQL docs in `localhost:PORT/graphql`

### Testing

Using configured setup:

1. Start database in the background with:
   1. `sudo docker-compose -f docker-compose.test.yml build`
   2. `sudo docker-compose -f docker-compose.test.yml up`
2. Go to `backend/` folder
3. Run `yarn test:setup` to run migrations
4. Run `yarn test` to run tests
   1. This can be repeated as many times you wish

Using own database

1. configure your own postgresql database to run in localhost with the following connection URL = `'postgres://test:test@localhost:5432/test'`
2. Go to `backend/` folder
3. Run `yarn test:setup` to run migrations
4. Run `yarn test` to run tests
   1. This can be repeated as many times you wish

Common errors:
Delete test postgres volumes if something doesn't seem to work:

1. `sudo docker-compose -f docker-compose.test.yml down --volumes`
