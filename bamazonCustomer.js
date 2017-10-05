var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // my username
  user: 
  // my password
  password: "r00t",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw (err);
    console.log("connected as id" + connection.threadId);
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
          if (isNaN(value) === false) {
            return true;
          } 
          else {
            return false;
          }
        }
      },
      {
        name: "qty",
        type: "input",
        message: "What quantity do you wish to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          } 
          else {
            return false;
          }
        }
      }
    ])
    .then(function(answer) {
      connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?", {item_id : answer.itemID}, function(err, res) {
        if (err) throw (err);

        if (answer.itemID === 0 || answer.itemID > (res.length + 1)) {
          console.log("Sorry, that is not a valid ID #. Please try again.");
          itemOrder();
        } 

        else if (answer.qty > res[0].stock_quantity) {
            console.log("Insufficient quantity!");
            connection.end();
        }
    
        else {
          console.log("The item you have selected is: " + res[answer.itemID -1].product_name +
          " and the QTY: " + answer.qty);
          // updateQty(answer.qty, answer.itemID, res[0].stock_quantity);
          console.log("Your total comes out to $" + (res[0].price * answer.qty) + ".");
          connection.end();
        }
      });
    }); 
}

// function updateQty(qty, id, stock){
//   connection.query("UPDATE products SET? WHERE ?", [{stock_quantity: (stock-qty)}, {item_id: id}], function (err, res){
//     if (err) throw (err);
//     console.log("Thank you for your purchase!");
//     connection.end();
//   });
// }

