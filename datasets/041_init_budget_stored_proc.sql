
-- SQL script to initialize database stored procedures
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

USE `Grocery-Aid-Database`;

-- Get average price and count of a given product search as well as the overall statistics for each store
-- for user to compare product price against rest of store
DELIMITER //
CREATE PROCEDURE BudgetSearch(
  IN uid INT,
  IN budget DOUBLE,
  IN searchString VARCHAR(8192)
)
BEGIN
  DECLARE save_hist BOOL;
  DECLARE store_cheap_id VARCHAR(256);
  DECLARE avg_price DOUBLE;
  DECLARE search_list VARCHAR(8192);
  DECLARE curr_search VARCHAR(8192);
  DECLARE start_idx INT;
  DECLARE end_idx INT;
  DECLARE end_list INT DEFAULT 0;
  DECLARE item_cnt INT DEFAULT 0;
  DECLARE curr_prod VARCHAR(256);
  DECLARE curr_price REAL;
  DECLARE curr_store VARCHAR(256);

  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  START TRANSACTION;
    -- Temporary table to store result
    DROP TEMPORARY TABLE IF EXISTS BudgetResults;
    CREATE TEMPORARY TABLE BudgetResults (
      store_name    VARCHAR(256),
      name          VARCHAR(256),
      price         REAL
    );

    -- Count number of items being searched
    SET search_list = searchString;
    SET start_idx = 1;
    REPEAT
      SET end_idx = LOCATE(',', search_list);

      IF end_idx > 0 THEN
        SET curr_search = SUBSTRING(search_list, start_idx, end_idx - start_idx);
        SET search_list = SUBSTRING(search_list, end_idx + 1);
      ELSE
        SET curr_search = SUBSTRING(search_list, start_idx);
        SET end_list = 1;
      END IF;

      SET item_cnt = item_cnt + 1;
    UNTIL end_list
    END REPEAT;

    -- Find cheapest store that fits in budget
    SELECT 
      budget_stores.store_id, AvgPrice
    INTO 
      store_cheap_id,
      avg_price
    FROM (
        SELECT Stores.store_id, AVG(Products.price) AS AvgPrice 
        FROM Products 
          JOIN Stores ON Products.store_id = Stores.store_id 
          JOIN FoodGroup ON Products.product_id = FoodGroup.product_id 
        GROUP BY Stores.store_id
        HAVING (AVG(Products.price) * item_cnt) < budget
    ) AS budget_stores
    JOIN Products ON Products.store_id = budget_stores.store_id 
    ORDER BY budget_stores.AvgPrice ASC
    LIMIT 1;

    IF store_cheap_id IS NOT NULL THEN
      -- For each item, find cheapest version
      SET search_list = searchString;
      SET start_idx = 1;
      SET end_list = 0;
      REPEAT
        SET end_idx = LOCATE(',', search_list);

        IF end_idx > 0 THEN
          SET curr_search = TRIM(SUBSTRING(search_list, start_idx, end_idx - start_idx));
          SET search_list = SUBSTRING(search_list, end_idx + 1);
        ELSE
          SET curr_search = TRIM(SUBSTRING(search_list, start_idx));
          SET end_list = 1;
        END IF;

        SET curr_prod = NULL;
        SELECT Stores.store_name, Products.name, Products.price 
        INTO curr_store, curr_prod, curr_price
        FROM Products JOIN Stores
          ON Products.store_id = Stores.store_id
        WHERE 
          name LIKE CONCAT('%', curr_search, '%')
          AND price = (SELECT MIN(price) FROM Products WHERE name LIKE CONCAT('%', curr_search, '%') AND store_id = store_cheap_id)
          AND Stores.store_id = store_cheap_id
        LIMIT 1;

        IF curr_prod IS NOT NULL THEN
          INSERT INTO BudgetResults VALUES(curr_store, curr_prod, curr_price);
        END IF;
      UNTIL end_list
      END REPEAT;
    END IF;

    -- Update user's search history if they have search history enabled
    SELECT save_history INTO save_hist FROM Accounts WHERE user_id = uid;
    IF save_hist = 1 THEN
      INSERT INTO SearchHistory(user_id, search_string) VALUES(uid, searchString);
    END IF;

    -- Get final results
    SELECT * FROM BudgetResults;

    -- Remove temporary table
    DROP TEMPORARY TABLE IF EXISTS ItemStats;
  COMMIT;
END //
DELIMITER ;
