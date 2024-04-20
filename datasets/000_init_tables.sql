-- SQL script to initialize database tables
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

CREATE DATABASE `Grocery-Aid-Database`;

USE `Grocery-Aid-Database`;

CREATE TABLE Stores(
  store_id      INT AUTO_INCREMENT,
  store_name    VARCHAR(255),
  PRIMARY KEY   (store_id)
);

CREATE TABLE Products(
  product_id    INT AUTO_INCREMENT,
  store_id      INT NOT NULL,
  name          VARCHAR(255),
  price         REAL,
  PRIMARY KEY   (product_id),
  FOREIGN KEY   (store_id) REFERENCES Stores(store_id)
);

CREATE TABLE Accounts(
  user_id       INT AUTO_INCREMENT,
  first_name    VARCHAR(255),
  last_name     VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  email_addr    VARCHAR(255) NOT NULL,
  save_history  BOOL DEFAULT 1,
  PRIMARY KEY   (user_id)
);

CREATE TABLE SearchHistory(
  history_id    INT AUTO_INCREMENT,
  user_id       INT NOT NULL,
  search_string VARCHAR(255),
  timestamp     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY   (history_id),
  FOREIGN KEY   (user_id) REFERENCES Accounts(user_id)
    ON DELETE CASCADE
);

CREATE TABLE FoodGroup(
  food_id       INT AUTO_INCREMENT,
  product_id    INT NOT NULL,
  grains        BOOL NOT NULL,
  spices        BOOL NOT NULL,
  condiments    BOOL NOT NULL,
  meats         BOOL NOT NULL,
  fruits        BOOL NOT NULL,
  vegetables    BOOL NOT NULL,
  dairy         BOOL NOT NULL,
  other         BOOL NOT NULL,
  PRIMARY KEY   (food_id),
  FOREIGN KEY   (product_id) REFERENCES Products(product_id)
    ON DELETE CASCADE
);