-- SQL script to initialize database stored procedures
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

USE `Grocery-Aid-Database`;

-- Probability you'll find given item in each store + for each one with prob > 0 => where it lies in the price distribution of given store (or maybe price distribution of that item)?
DELIMITER //
CREATE PROCEDURE GetItemStats (
  IN search VARCHAR(256)
)
BEGIN
  DECLARE stat_done INT DEFAULT 0;
  DECLARE curr_sid INT;
  DECLARE curr_avg REAL;
  DECLARE curr_std REAL;
  DECLARE curr_min REAL;
  DECLARE curr_max REAL;
  DECLARE curr_cnt INT;
  DECLARE curr_prb REAL;

  DECLARE bucket_start INT;
  DECLARE bucket_end INT;
  DECLARE bucket_done INT DEFAULT 0;
  
  DECLARE stat_cur CURSOR FOR (
    SELECT Stores.store_id, AVG(Products.price), STD(Products.price), MIN(Products.price), MAX(Products.price), COUNT(*)
    FROM Products JOIN Stores
      ON Products.store_id = Stores.store_id
    GROUP BY Stores.store_id
  );
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET stat_done = 1;

  DROP TEMPORARY TABLE IF EXISTS ItemStats;
  CREATE TEMPORARY TABLE ItemStats (
    store_id      INT,
    avg_price     REAL,
    std_price     REAL,
    min_price     REAL,
    max_price     REAL,
    total_count   INT
  );

  -- Create buckets in table for histogram
  SET bucket_start = -3;
  SET bucket_end = -2;
  SET @sql = CONCAT('ALTER TABLE ItemStats ADD `(min)-(', bucket_start, ')` INT DEFAULT 0;');
  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
  REPEAT
    SET @sql = CONCAT('ALTER TABLE ItemStats ADD `(', bucket_start, ')-(', bucket_end, ')` INT DEFAULT 0;');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    IF bucket_end = 3 THEN
      SET bucket_done = 1;
    END IF;

    SET bucket_start = bucket_end;
    SET bucket_end = bucket_end + 1;
  UNTIL bucket_done
  END REPEAT;
  SET @sql = CONCAT('ALTER TABLE ItemStats ADD `(', bucket_start, ')-(max)` INT DEFAULT 0;');
  PREPARE stmt FROM @sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

  -- For each store, fill buckets
  OPEN stat_cur;
  FETCH stat_cur INTO curr_sid, curr_avg, curr_std, curr_min, curr_max, curr_cnt;
  REPEAT
    INSERT INTO ItemStats(store_id, avg_price, std_price, min_price, max_price, total_count)
    VALUES(curr_sid, curr_avg, curr_std, curr_min, curr_max, curr_cnt);

    -- Iterate through buckets and count number of items 
    SET bucket_start = -3;
    SET bucket_end = -2;
    SET bucket_done = 0;
    -- Do the left tail
    SELECT COUNT(*) 
    INTO curr_cnt
    FROM Products
    WHERE price <= curr_avg + bucket_start * curr_std AND store_id = curr_sid;
    SET @sql = CONCAT('UPDATE ItemStats SET `(min)-(', bucket_start, ')` = ', curr_cnt ,' WHERE store_id = ', curr_sid, ';');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;  
    REPEAT
      SELECT COUNT(*) 
      INTO curr_cnt
      FROM Products
      WHERE price > curr_avg + bucket_start * curr_std
        AND price <= curr_avg + bucket_end * curr_std
        AND store_id = curr_sid;
      
      SET @sql = CONCAT('UPDATE ItemStats SET `(', bucket_start, ')-(', bucket_end, ')` = ', curr_cnt ,' WHERE store_id = ', curr_sid, ';');
      PREPARE stmt FROM @sql;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;

      IF bucket_end = 3 THEN
        SET bucket_done = 1;
      END IF;

      SET bucket_start = bucket_end;
      SET bucket_end = bucket_end + 1;
    UNTIL bucket_done
    END REPEAT;
    -- Do the right tail
    SELECT COUNT(*) 
    INTO curr_cnt
    FROM Products
    WHERE price > curr_avg + bucket_end * curr_std AND store_id = curr_sid;
    SET @sql = CONCAT('UPDATE ItemStats SET `(', bucket_start, ')-(max)` = ', curr_cnt ,' WHERE store_id = ', curr_sid, ';');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;  

    FETCH stat_cur INTO curr_sid, curr_avg, curr_std, curr_min, curr_max, curr_cnt;
  UNTIL stat_done
  END REPEAT;

  -- Get Results
  SELECT *
  FROM ItemStats NATURAL JOIN (
    SELECT 
      Stores.store_name AS store_name, 
      Stores.store_id AS store_id, 
      COUNT(Products.name) as prod_count,
      AVG(Products.price) as prod_avg_price
    FROM Products JOIN Stores
      ON Products.store_id = Stores.store_id
    WHERE Products.name LIKE CONCAT('%', search ,'%')
    GROUP BY Stores.store_id
  ) AS ProductProb;

  DROP TEMPORARY TABLE IF EXISTS ItemStats;
END //
DELIMITER ;
