USE bamazon;
SELECT * FROM products;
SELECT * FROM departments;







DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;

CREATE TABLE products(
item_id int NOT NULL auto_increment,
product_name VARCHAR(50),
department_name VARCHAR(50),
price DECIMAL(10,2),
stock_quantity int,
PRIMARY KEY(item_id)
);

ALTER TABLE products 
ADD product_sales DECIMAL(10,2);
SELECT * FROM products;

USE bamazon;
UPDATE products
SET product_sales = 1000
WHERE item_id = 13;
SELECT * FROM products;

USE bamazon;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Awesome Book", "Books", 29.47, 50),
("MySQL for Dummies", "Books", 10.98, 50),
("Pretty Necklace", "Accessories", 57.96, 50),
("Fancy Watch", "Accessories", 100.00, 50),
("Kind Bars 10-pk", "Pantry", 6.98, 100),
("Water Bottle 12-pk", "Pantry", 2.97, 100),
("Bamazon Dress", "Clothing", 20.64, 100),
("Bamazon Tie", "Clothing", 9.50, 100),
("Batteries", "Electronics", 4.99, 500),
("32GB MicroSD Card", "Electronics", 15.89, 50);

UPDATE products SET stock_quantity = 50 WHERE item_id = 1;

USE bamazon;
SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 10;

USE bamazon;
ALTER TABLE departments 
ADD product_sales DECIMAL(10,2);
SELECT * FROM products;


CREATE TABLE departments(
department_id int NOT NULL auto_increment,
department_name VARCHAR(50),
over_head_costs int,
PRIMARY KEY(department_id)
);

USE bamazon;
INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books", 1000),
("Accessories", 1000), 
("Pantry", 1000),
("Clothing", 1000),
("Electronics", 1000);






USE bamazon;
SELECT departments.department_id, departments.department_name,
departments.over_head_costs, products.product_sales, (products.product_sales - departments.over_head_costs) total_profit
FROM departments
INNER JOIN products ON departments.department_name = products.department_name
GROUP BY department_id;

