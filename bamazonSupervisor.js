var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var table = new Table({
  head: ['department_id', "department_name", "overhead_costs", "product_sales", "total_profit"],
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

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

// I need to fix the sum on product_sales column, it is not showing correctly when I group rows.
// However, the total_profit is correct

function viewProductSales() {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs," +
    " products.product_sales, SUM(products.product_sales - departments.over_head_costs) total_profit" +
    " FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_id", function(err, res) {
      if (err) throw err;
      for (i = 0; i < res.length ; i++){
        table.push(
         [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]
        );
      }
      console.log(table.toString());
      connection.end();
  });
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
        console.log(res.affectedRows + " department successfully added!\n");
        connection.end();
      });
    });
}