
-- Run this using:
--    mysql --local-infile=1 -h 127.0.0.1 -P 8001 -u root -p < ./import_data.sql

USE Grocery-Aid-Database;

INSERT INTO Stores(store_name) VALUES ('Amazon'); 
INSERT INTO Stores(store_name) VALUES ('Costco');
INSERT INTO Stores(store_name) VALUES ('Walmart');
INSERT INTO Stores(store_name) VALUES ('Whole Foods');

SET GLOBAL local_infile=1;

LOAD DATA LOCAL INFILE './GenericAccounts.csv' INTO TABLE Accounts FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY ';' IGNORE 1 LINES (last_name, first_name, email_addr, save_history, password_hash);
LOAD DATA LOCAL INFILE './SearchHistories.csv' INTO TABLE SearchHistory FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY ';' IGNORE 1 LINES (user_id, search_string);

LOAD DATA LOCAL INFILE './Amazon_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY ';' IGNORE 1 LINES (name, price) SET store_id = 1;
LOAD DATA LOCAL INFILE './Costco_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY ';' IGNORE 1 LINES (name, price) SET store_id = 2;
LOAD DATA LOCAL INFILE './Walmart_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY ';' IGNORE 1 LINES (name, price) SET store_id = 3;
LOAD DATA LOCAL INFILE './WholeFood_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY ';' IGNORE 1 LINES (name, price) SET store_id = 4;

INSERT INTO FoodGroup(product_id, grains, spices, condiments,  meats, fruits, vegetables, dairy, other) SELECT product_id, 0, 0, 0, 0, 0, 0, 0, 1 FROM Products;