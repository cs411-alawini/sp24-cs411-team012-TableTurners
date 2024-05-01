-- SQL script to initialize database indexes
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

USE `Grocery-Aid-Database`;


CREATE UNIQUE INDEX account_email_idx ON Accounts (email_addr);

CREATE INDEX product_name_idx ON Products (name);
CREATE INDEX product_store_id_idx ON Products (store_id);
CREATE INDEX product_price_idx ON Products (price);

CREATE INDEX history_user_id_idx ON SearchHistory (user_id);

CREATE INDEX group_product_id_idx ON FoodGroup (product_id);
