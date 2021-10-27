#!/bin/bash

echo -n "Enter username: "
read ADMIN_USERNAME
echo -n "Enter email: "
read ADMIN_EMAIL
echo -n "Enter password: "
read ADMIN_PASSWORD

sudo docker exec -it amandus_backend_1 yarn add-admin $ADMIN_USERNAME $ADMIN_EMAIL $ADMIN_PASSWORD 
    