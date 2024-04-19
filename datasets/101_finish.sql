-- SQL script to create database to mark docker container as ready
-- If this database can be reached by mysql, the container should be ready
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

CREATE DATABASE DOCKER_DB_READY;

