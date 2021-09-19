# Amandus

Web application to edit Robot Framework files remotely

[Application in production](http://135.181.89.96:4000/)

## How to run locally for development

* Requirements: `docker`, `docker-compose` & `yarn`

1. Create the `.env` file in `/backend` with the proper values (see `backend/.env.dist`)
     1. Check [Backend documentation](/documentation/backend.md) for more details on environment values if needed
2. Install backend and frontend node modules
    1. `cd backend/ && yarn`
    2. `cd frontend/ && yarn`
3. Run `sudo docker-compose build`
4. Run `sudo docker-compose up`
     1. If database migrations seem to fail at start, run `sudo docker-compose up` again or `sudo docker-compose down --volumes` & `sudo docker-compose up`
5. The application should be viewable in `localhost:3000`


## Documentation

[General](documentation/general.md)

[Frontend documentation](/documentation/frontend.md)

[Backend documentation](/documentation/backend.md)

[Database documentation](/documentation/database.md)

[Manual](/documentation/manual.md)

[Summary](/documentation/summary.md)

[Working hours](https://docs.google.com/spreadsheets/d/1YDC3QcxFgtNw_KvYTQlDE8rA0DA7rvMYv_ZlsHXdvww)

### Definition of done

- Feature is implemented
- Features are tested and tests are passed 
- Documentation is updated to match the state of the application
- Code is reviewed: at least 1 person have accepted changes in the pull request
- The feature works in production environment
