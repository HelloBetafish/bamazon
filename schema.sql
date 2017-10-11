DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;

CREATE TABLE products(
item_id int NOT NULL auto_increment,
product_name VARCHAR(50),
department_name VARCHAR(50),
price DECIMAL(10,2),
stock_quantity int,
product_sales DECIMAL(10,2);
PRIMARY KEY(item_id)
);

USE bamazon;
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Awesome Book", "Books", 29.47, 50, 0),
("MySQL for Dummies", "Books", 10.98, 50, 0),
("Pretty Necklace", "Accessories", 57.96, 50, 0),
("Fancy Watch", "Accessories", 100.00, 50, 0),
("Kind Bars 10-pk", "Pantry", 6.98, 100, 0),
("Water Bottle 12-pk", "Pantry", 2.97, 100, 0),
("Bamazon Dress", "Clothing", 20.64, 100, 0),
("Bamazon Tie", "Clothing", 9.50, 100, 0),
("Batteries", "Electronics", 4.99, 500, 0),
("32GB MicroSD Card", "Electronics", 15.89, 50, 0);

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

