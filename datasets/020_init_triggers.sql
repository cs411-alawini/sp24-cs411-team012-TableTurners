-- SQL script to initialize database triggers
-- This script is run by the mysql docker container on initialization (first run on fresh data volume)
--    These scripts are numbered so that they are run in order by the mysql docker container

USE `Grocery-Aid-Database`;

-- Trigger to prevent duplicate emails from arising
delimiter //
CREATE TRIGGER ins_acct BEFORE INSERT ON Accounts
    FOR EACH ROW
    BEGIN
        DECLARE email_count INT;
        SELECT COUNT(*) INTO email_count FROM Accounts WHERE email_addr = NEW.email_addr;
        IF email_count > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: A record with the same email address already exists!';
        END IF;
    END; //
delimiter ;

-- Trigger to prevent duplicate 