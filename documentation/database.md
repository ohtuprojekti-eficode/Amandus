# Database documentation

## Development

- to gain access for existing database:
  - `sudo docker-compose up` in the background to run services
  - `sudo docker-compose run userdata bash`
- to connect with database created: `psql --host=userdata --username=ohtu_user --dbname=account_database`

  - password is ohtupassword
  - These values can be edited with the `userdata/userdata.env` but make sure to change dev scripts in `backend/package.json` as well if you wish to do that

- while in database \d shows tables etc.

- to destroy volume: docker-compose down --volumes

### Migrations

- Make sure you have the development `docker-compose` running while attempting these commands

- Tables created with backend scripts
  - `yarn migrate-up-dev` for localhost development & `yarn migrate-up-prod` for other use cases
- Tables removed with:

  - `yarn migrate-down-dev` for localhost development & `yarn migrate-down-prod` for other use cases

- Migrations are needed when:
  - Tables are changed (more or less tables or different fields in tables)
- Development `docker-compose` also runs the `yarn migrate-up-dev` command to create database tables during startup so everything should work automatically

Below is the described database structure

![Database](./imgs/Amandus%20DB.png)
