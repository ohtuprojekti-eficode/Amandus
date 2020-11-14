/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE USERS(
        id serial PRIMARY KEY,    
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        password TEXT NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login TIMESTAMP);`)

  pgm.sql(`CREATE TABLE SERVICES(
        id serial PRIMARY KEY,
        name TEXT UNIQUE NOT NULL);`)

  pgm.sql(`CREATE TABLE SERVICE_USERS(
        id serial PRIMARY KEY,
        user_id INTEGER REFERENCES USERS(id) ON DELETE CASCADE,
        services_id INTEGER REFERENCES SERVICES(id) ON DELETE CASCADE,
        username TEXT, 
        email TEXT,
        token TEXT,
        reposurl TEXT,
        UNIQUE(services_id, username));`)

  pgm.sql(`CREATE TABLE REPO(
        id serial PRIMARY KEY,
        service_user_id INTEGER REFERENCES SERVICE_USERS(id) ON DELETE CASCADE,
        web_url TEXT);`)

  pgm.sql(`INSERT INTO SERVICES(name) VALUES('github');`)
}

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE REPO;`)
  pgm.sql(`DROP TABLE SERVICE_USERS;`)
  pgm.sql(`DROP TABLE USERS;`)
  pgm.sql(`DROP TABLE SERVICES;`)
}
