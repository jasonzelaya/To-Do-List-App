// Incorporate modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initiate app
const app = express();

// Use EJS
app.set("view engine", "ejs");

// Enable use of body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Serve static files in 'public' directory
app.use(express.static("public"));

// Create a new Mongo database in MongoDB
mongoose.connect("mongod://localhost:27017/todolistDB", {
  // Fix the URL string parser deprecation warning
  useNewUrlParser: true,
  // Fix Server Discovery and Monitoring Engine deprecation warning
  useUnifiedTopology: true
});

// -----------------------------------------------------------------

let Schema = mongoose.Schema;

// Create a schema
const itemsSchema = new Schema ({
  name: String;
});

// Create a model
const Item = mongoose.model("Item", itemsSchema);

// Create 3 documents
const item = new Item ({
  {}
);





// ----------------Global Variables--------------------

// Create an array to put the root's items in
let items = ["Item 1", "Item 2", "Item 3"];
// Create an array to put the work page's items in
let workItems = [];

// -------------------ITEMS LIST-----------------------
// GET handler for the root list
app.get("/", function(req, res) {
  // Pass values into index.ejs variables
  res.render("index", {listTitle: "Today", newListItems: items});

});

// POST handler
app.post("/", function(req, res) {
  // Grab the new item value the user entered
  let item = req.body.newItem;
  // If the title of the page is "Work"
  if (req.body.list === "Work") {
    // Add the new item to the Work page's list
    workItems.push(item);
    // Have the submit button send the user back to the Work page
    res.redirect("/work")
  } else {
   // Add the new item to the root's list
  items.push(item);
  // Have the submit button send the user to the root list
  res.redirect("/");
  }
});


// --------------------WORK LIST-----------------------

// GET handler for the Work page
app.get("/work", function(req, res) {
  // Render the Work page with an updated list
  res.render("index", {listTitle: "Work List", newListItems: workItems});
});


// POST handler for the Work page
app.post("/work", function(req, res) {
  // Grab the new item the user entered
  let item = req.body.newItem;
  // Add the new item to the Work page's list
  workItems.push(item);
  // Return to the root
  res.redirect("/");
});








// Start server
app.listen(/*process.env.PORT*/3000, function() {
  console.log("Server is running on port 3000");
});
