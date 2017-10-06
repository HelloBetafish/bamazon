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
SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5;