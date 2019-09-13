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
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  // Fix the URL string parser deprecation warning
  useNewUrlParser: true,
  // Fix Server Discovery and Monitoring Engine deprecation warning
  useUnifiedTopology: true
});

// -------------------------Items Start----------------------------------------
// Create an items schema
let itemsSchema = new mongoose.Schema ({
  name: String
});

// Create an Item model
let Item = mongoose.model("Item", itemsSchema);

// Create 3 Item documents
let item1 = new Item ({
  name: "Welcome to your To Do List!"
});

let item2 = new Item ({
  name: "Hit the + button to add a new item."
});

let item3 = new Item ({
  name: "<-- Hit this checkbox to delete an item."
});

// Create an array to hold the premade list items
let defaultItems = [item1, item2, item3];

// -------------------ITEMS End-----------------------

// ------------------LIST START-----------------------

// Create a list schema
let listSchema = {
  name: String,
  // items value will be an array of items documents
  items: [itemsSchema]
});

// Create a List model
let List = mongoose.model("List", listSchema);


// ------------------LIST END-------------------------



// GET handler for root
app.get("/", function(req, res) {
  // Find the items in the collection
  Item.find({}, function(err, items) {
    // Check if the "items" array is empty
    if (items.length === 0) {
      // Insert the defaultItems values into the Item collection
      Item.insertMany(defaultItems, function(err) {
        // Check if an error has occurred
        if (err) {
          // Print the error to the console
          console.log(err);
        } else {
          // Print the "success" message
          console.log("Successfully inserted default items to DB");
        }
      });
      // Rerun "/'s" GET handler to ensure the array is rendered
      res.redirect("/");
    } else {
    // Render updated values
      res.render("index", {listTitle: "Today", newListItems: items});
    }
  });

});


// GET handler for the dynamic route
app.get("/:customListName", function(req, res) {
  // Store the dyanmic route path in a variable
  let customListName = req.params.customListName;

});


// POST handler for root
app.post("/", function(req, res) {
  // Grab item input text from index.ejs
  let newItem = req.body.newItem
  // Create an Item document
  let itemName = new Item ({
    name: newItem
  });
  // Save the document
  itemName.save()
  // Render itemName
  res.redirect("/")
});


// POST handler for the "delete" route
app.post("/delete", function(req, res) {
  // Grab the checkbox clicked from index.ejs
  let checkedItemId = req.body.deleteItem;
  // Find the item with a checked box via the item's id and remove it from the list
  Item.findByIdAndRemove(checkedItemId, function(err) {
    // Check if an error occurred
    if (err) {
      // Print the error to the console
      console.log(err);
    } else {
      // Print message to confirm the item was deleted
      console.log("Succesfully deleted item with _id: " + checkedItemId);
      // Send the user back to the "to do" list
      res.redirect("/");
    }
  });
});

// --------------------WORK LIST-----------------------



// GET handler for the Work page
// app.get("/work", function(req, res) {
  // Render updated values
  // res.render("index", {listTitle: "Work List", newListItems: workItems});
// });


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
