#!/usr/bin/env sh
# Shell script to initialize database data with csv values 
# if "MYSQL_FILL_EXAMPLE_DATA" environment variable is set to "true"

# This script is run by the mysql docker container on initialization (first run on fresh data volume)
#    These scripts are numbered so that they are run in order by the mysql docker container

if [[ "$MYSQL_FILL_EXAMPLE_DATA" == "true" ]]; then
  mysql --local-infile=1 -u root -p$MYSQL_ROOT_PASSWORD < /docker-entrypoint-initdb.d/010_import_data_script
fi

