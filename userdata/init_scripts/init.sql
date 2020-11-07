CREATE TABLE USERS(
    user_id serial PRIMARY KEY,    
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE TABLE SERVICES(
    service_id serial PRIMARY KEY,
    name TEXT
);

CREATE TABLE SERVICE_USERS(
    service_user_id serial PRIMARY KEY,
    user_id INTEGER REFERENCES USERS ON DELETE CASCADE,
    service_id INTEGER REFERENCES SERVICES ON DELETE CASCADE,
    username TEXT, 
    email TEXT,
    token TEXT,
    reposurl TEXT
);

CREATE TABLE REPO(
    repo_id serial PRIMARY KEY,
    service_user_id INTEGER REFERENCES SERVICE_USERS ON DELETE CASCADE,
    web_url TEXT
);

