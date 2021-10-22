#!/bin/bash

ADMIN_USERNAME=${1}
ADMIN_EMAIL=${2}
ADMIN_PASSWORD=${3}

docker exec -it amandus_backend_1 yarn add-admin $ADMIN_USERNAME $ADMIN_EMAIL $ADMIN_PASSWORD
