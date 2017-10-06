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
    displayItems();
});

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
    itemOrder();
  });
}

function itemOrder(){
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: "Please identify the Item Id # you wish to purchase:",
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
        name: "qty",
        type: "input",
        message: "What quantity do you wish to purchase?",
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
    .then(function(answer) {
      connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?", {item_id : answer.itemID}, function(err, res) {
        if (err) throw (err);

        if (answer.qty > res[0].stock_quantity) {
            console.log("Insufficient quantity!");
            connection.end();
        }
    
        else {
          console.log("The item you have selected is: " + res[0].product_name +
          " with QTY: " + answer.qty);
          updateQty(answer.itemID, res[0].stock_quantity, answer.qty);
          console.log("Your total comes out to $" + (res[0].price * answer.qty).toFixed(2) + ".");
        }
      });
    }); 
}

function updateQty(id, stock, qty){
  connection.query("UPDATE products SET? WHERE ?", [{stock_quantity: (stock-qty)}, {item_id: id}], function (err, res){
    if (err) throw (err);
    console.log("Thank you for your purchase!" +
    "\n-------------------------------------------------------------------------");
    connection.end();
  });
}

