#!/usr/bin/env bash

echo "Inserting data may take a while, please be patient."

DB_NAME="Grocery-Aid-Database"

printf "MySQL Host (default: 127.0.0.1): "
read hostname

if [ "$hostname" == "" ]; then
  hostname="127.0.0.1"
fi;
echo $hostname

printf "MySQL User (default: root): "
read user
if [ "$user" == "" ]; then
  user="root"
fi;
echo $user

DIRNAME=$(pwd)

echo "
INSERT INTO Stores(store_name) VALUES ('Amazon'); 
INSERT INTO Stores(store_name) VALUES ('Costco');
INSERT INTO Stores(store_name) VALUES ('Walmart');
INSERT INTO Stores(store_name) VALUES ('Whole Foods');

SET GLOBAL local_infile=1;

LOAD DATA LOCAL INFILE '$DIRNAME/GenericAccounts.csv' INTO TABLE Accounts FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (last_name, first_name, email_addr, password_hash);
LOAD DATA LOCAL INFILE '$DIRNAME/SearchHistories.csv' INTO TABLE SearchHistory FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (user_id, search_string);

LOAD DATA LOCAL INFILE '$DIRNAME/Amazon_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (name, price) SET store_id = 1;
LOAD DATA LOCAL INFILE '$DIRNAME/Costco_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (name, price) SET store_id = 2;
LOAD DATA LOCAL INFILE '$DIRNAME/Walmart_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (name, price) SET store_id = 3;
LOAD DATA LOCAL INFILE '$DIRNAME/WholeFood_Cleaned.csv' INTO TABLE Products FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n' IGNORE 1 LINES (name, price) SET store_id = 4;

INSERT INTO FoodGroup(product_id, grains, spices, condiments,  meats, fruits, vegetables, dairy, other) SELECT product_id, 0, 0, 0, 0, 0, 0, 0, 1 FROM Products;
" > temp.sql

mysql --local-infile=1 -h $hostname -u $user -p -f $DB_NAME  < "temp.sql"

rm temp.sql