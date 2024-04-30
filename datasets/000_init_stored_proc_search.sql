USE `Grocery-Aid-Database`;

-- Get average price and count of a given product search as well as the overall statistics for each store
-- for user to compare product price against rest of store
DELIMITER //
CREATE PROCEDURE BudgetSearch(
    IN budget DOUBLE,
    IN searchString VARCHAR(256)
)
BEGIN
    DECLARE store_cheap VARCHAR(256);
    DECLARE avg_price DOUBLE;
    SELECT 
        budget_stores.store_name, Products.price 
    INTO 
        store_cheap,
        avg_price
    FROM (
        SELECT Stores.store_name, Stores.store_id, AVG(Products.price) AS AvgPrice 
        FROM Products 
        JOIN Stores ON Products.store_id = Stores.store_id 
        JOIN FoodGroup ON Products.product_id = FoodGroup.product_id 
        WHERE other = 1 
        GROUP BY Stores.store_id
        HAVING AVG(Products.price) < budget
    ) AS budget_stores
    JOIN Products ON Products.store_id = budget_stores.store_id 
    ORDER BY budget_stores.AvgPrice ASC
    LIMIT 1;

    SELECT DISTINCT Stores.store_name, Products.name, Products.price AS min_price
    FROM Stores JOIN Products ON Stores.store_id = Products.store_id
         INNER JOIN ( SELECT store_id, MIN(price) AS price FROM Products WHERE name
         LIKE CONCAT('%', searchString, '%') GROUP BY store_id) AS min_prices         
         ON Stores.store_id = min_prices.store_id AND Products.price = min_prices.price 
        WHERE Products.name LIKE CONCAT('%', searchString, '%') and Stores.store_name = store_cheap 
    ORDER BY Stores.store_name ASC, Products.price ASC;

END//

DELIMITER ;