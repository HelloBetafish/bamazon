var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // my username
  user: "root",
  // my password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw (err);
    // console.log("connected as id" + connection.threadId);
    listOptions();
});

function listOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          displayItems();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add to Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProduct();
          break;
      }
    });
}

function displayItems() {
  connection.query("SELECT * FROM products", function(err, res){
    if (err) throw (err);
    for (var i = 0 ; i < res.length ; i++) {
      console.log("-------------------------------------------------------------------------\n");
      console.log("ITEM ID: " + res[i].item_id + "\n ~ " + res[i].product_name +
      " || DEPARTMENT: " + res[i].department_name + " || PRICE: " + res[i].price + 
      " || STOCK: " + res[i].stock_quantity); 
      console.log("\n-------------------------------------------------------------------------");
    }
    connection.end();
  });
}

function lowInventory() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw (err);
    if(!res[0]) {
      console.log("There is no low inventory at this time.");
      connection.end();
    }
    else {
      console.log("-------------------------------------------------------------------------");
      console.log("These items below have low inventory: ");
      console.log("------------------------------------");
      for (var i = 0 ; i < res.length ; i++) {
        console.log("ITEM ID: " + res[i].item_id + "\n ~ " + res[i].product_name + 
        " || STOCK: " + res[i].stock_quantity); 
        console.log("-------------------------------------------------------------------------");
      }
      connection.end();
    }
  });
}

function addInventory() {
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: "What is the Item ID # for which you wish to add inventory?",
        validate: function(value) {
          if (isNaN(value) === true || value === "") {
            return false;
          } 
          else {
            return true;
          }
        }
      },
      {
        name: "addInv",
        type: "input",
        message: "How much inventory would you like to add? ",
        validate: function(value) {
          if (isNaN(value) === true || value === "") {
            return false;
          } 
          else {
            return true;
          }
        }
      }
    ])
    .then(function(answer){
      connection.query("SELECT item_id, stock_quantity, product_name FROM products WHERE ?", {item_id : answer.itemID}, function (err, res){
        if (err) throw (err);
        var id = res[0].item_id;
        var stock = res[0].stock_quantity;
        var qty = answer.addInv;
        var product = res[0].product_name;
        updateInventory(id, stock, qty, product);
      });
    });
}

function updateInventory(id, stock, qty, product) {
  var total = parseInt(stock) + parseInt(qty);
  connection.query("UPDATE products SET? WHERE ?", [{stock_quantity: total}, {item_id: id}], function (err, res){
    if (err) throw (err);
    console.log(res.affectedRows + " product updated!\n")
    console.log("Inventory for \'" + product + "\' is now "+ total + 
    "\n-------------------------------------------------------------------------");
    connection.end();
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the product?",
        validate: function(value) {
          if (value === "") {
            return false;
          } 
          else {
            return true;
          }
        }
      },
      {
        name: "department",
        type: "input",
        message: "What department does this product belong to?",
        validate: function(value) {
          if (value === "") {
            return false;
          } 
          else {
            return true;
          }
        }
      },
      {
        name: "price",
        type: "input",
        message: "What is the price?",
        validate: function(value) {
          if (isNaN(value) === true || value === "") {
            return false;
          } 
          else {
            return true;
          }
        }
      },
      {
        name: "inventory",
        type: "input",
        message: "What is the starting inventory?",
        validate: function(value) {
          if (isNaN(value) === true || value === "") {
            return false;
          } 
          else {
            return true;
          }
        }
      }
    ])
    .then(function(answer){
      connection.query("INSERT INTO products SET ?",
      {
        product_name: answer.name,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.inventory
      },
      function(err, res){
        if (err) throw (err);
        console.log(res.affectedRows + " product successfully added!\n");
        connection.end();
      });
    });
}