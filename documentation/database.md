# Database documentation

- to gain access for existing database:
  - `sudo docker-compose up` in the background to run services
  - `sudo docker-compose run userdata bash`
- to connect with database created: `psql --host=userdata --username=ohtu_user --dbname=account_database`
  - password is ohtupassword
- while in database \d shows tables etc.

- to destroy volume: docker-compose down --volumes
