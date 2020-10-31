CREATE TABLE USERS(
    user_id serial PRIMARY KEY,    
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);

CREATE TABLE SERVICES(
    service_id serial PRIMARY KEY,
    name VARCHAR
);

CREATE TABLE SERVICE_USERS(
    service_user_id serial PRIMARY KEY,
    user_id INTEGER REFERENCES USERS (user_id),
    service_id INTEGER REFERENCES SERVICES (service_id),
    username VARCHAR, 
    email VARCHAR,
    token VARCHAR,
    reposurl VARCHAR
);

CREATE TABLE REPO(
    repo_id serial PRIMARY KEY,
    service_user_id INTEGER REFERENCES SERVICE_USERS (service_user_id),
    web_url VARCHAR
);

