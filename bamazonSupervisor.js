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
        "View Product Sales by Department",
        "Create New Department"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
          viewProductSales();
          break;
        case "Create New Department":
          createNewDept();
          break;
      }
    });
}

function viewProductSales() {
 console.log("in progress");
 connection.end();
}

function createNewDept() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What is the name of the department you wish to add?",
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
        name: "overh_costs",
        type: "input",
        message: "What are the starting overhead costs?",
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
      connection.query("INSERT INTO departments SET ?",
      {
        department_name: answer.department,
        over_head_costs: answer.overh_costs
      },
      function(err, res){
        if (err) throw (err);
        console.log(res.affectedRows + " product successfully added!\n");
        connection.end();
      });
    });
}