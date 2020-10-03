CREATE TABLE accounts(
    account_id serial PRIMARY KEY,
    webaddress VARCHAR,
    account VARCHAR UNIQUE NOT NULL,
    serviceName VARCHAR,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP
);