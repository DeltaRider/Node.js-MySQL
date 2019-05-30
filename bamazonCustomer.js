var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "password",
    database: "bamazon",
});

startApp();

function startApp() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    inquirer.prompt([
      {
        type: "input",
        name: "item_id",
        message: "Please type the ID of the product you wish to buy:"
      },
      {
          type: "input",
          name: "units",
          message: "How many do you wish to purchase?"
      },
    
      {
        type: "confirm",
        name: "order",
        message: "Are you ready to place your order?"
      }
    
    ]).then(function(purchase) {
  
      var id = purchase.item_id;
      var num = parseInt(purchase.units);
      console.log("Quantity purchased is ", num);
  
      var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
      connection.query(query, { item_id: id }, function(err, res) {
  
        if (err) throw err;
        var productName = res.product_name;
        var newInventoryCount = parseInt(res.stock_quantity) - num;
        var invoice = parseFloat(res.price) * num;
  
        if (purchase.order && newInventoryCount < 0) {
          console.log("==============================================");
          console.log("");
          console.log("Insufficient quantity!");
          console.log("");
          console.log("==============================================");
          return;
  
        } else if (purchase.order && newInventoryCount > 0){
          
          var query = "UPDATE products SET stock_quantity=" + newInventoryCount + " WHERE item_id=" + id;
          connection.query(query, function(err, updtd) {
            if (err) throw err;
            console.log("updated products table ", updtd);
            console.log("==============================================");
            console.log("");
            console.log("The total cost for " + num + " of " + productName + " with id of " + id + " is "+ invoice + ".");
            console.log("Your order has been placed.");
            console.log("");
            console.log("==============================================");
            return;
          });
        }
    });   
    });
  });
}