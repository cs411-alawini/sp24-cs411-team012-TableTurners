
-- SQL script to initialize database triggers
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

USE `Grocery-Aid-Database`;

-- Trigger to check save history before inserting 
DELIMITER //

CREATE TRIGGER CheckSaveHistory BEFORE INSERT ON SearchHistory
FOR EACH ROW
BEGIN
    DECLARE save_setting BOOL;
    SELECT save_history INTO save_setting
    FROM Accounts
    WHERE user_id = NEW.user_id;
    IF save_setting = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'user has disabled saving history';
    END IF;
END //

DELIMITER ;