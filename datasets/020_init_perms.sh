#!/usr/bin/env sh
# SQL script to give permissions to MYSQL_USER (if it is defined)
# This script is run by the mysql docker container on initialization (first run on fresh data volume)
#    These scripts are numbered so that they are run in order by the mysql docker container

if [[ "$MYSQL_USER" != "" ]]; then
  mysql --local-infile=1 -u root -p$MYSQL_ROOT_PASSWORD -e "GRANT ALL PRIVILEGES ON \`Grocery-Aid-Database\`.* TO '$MYSQL_USER'@'%'"
fi

