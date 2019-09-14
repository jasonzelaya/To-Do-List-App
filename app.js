// Incorporate modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

// Initiate app
const app = express();

// Use EJS
app.set("view engine", "ejs");

// Use Body-Parser
app.use(bodyParser.urlencoded({extended: true}));
// Serve static files in the 'public' directory
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
};

// Create a List model
let List = mongoose.model("List", listSchema);


// ------------------LIST END-------------------------

// -----------------HANDLERS--------------------------

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
  // Titlecase and store the dynamic route path in a variable
  let customListName = _.capitalize(req.params.customListName);
  // Check to see if the route entered matches an existing document's name
  List.findOne({name: customListName}, function(err, foundList){
    // Check for errors
    if (err) {
      // Print the error message
      console.log(err);
    } else {
        // If the entered route matches an existing document's name
        if(foundList) {
          // Render the existing document that matched the route entered
          res.render("index", {listTitle: foundList.name, newListItems: foundList.items});
        } else {
          // Create a new list
          let list = new List({
            // Name of the list = dynamic route entered
            name: customListName,
            items: defaultItems
          });
          // Save the list
          list.save();
          // Redirect back to the current route
          res.redirect("/" + customListName);
        }
    }
  });
});


// POST handler for root
app.post("/", function(req, res) {
  // Grab item input text from index.ejs
  let newItem = req.body.newItem;
  // Grab the list the submit button is adding the item to
  let listName = req.body.list;
  // Create an Item document
  let itemName = new Item ({
    name: newItem
  });

    // Check if the list being added to was the root's list
    if (listName === "Today") {
      // Update the list
      itemName.save();
      // Send the user to the root route
      res.redirect("/");
    } else {
       // Find the document to add the item to
      List.findOne({name: listName}, function(err, foundList){
        // Add the item to the document
        foundList.items.push(itemName);
        // Update the list
        foundList.save();
        // Redirect to the dynamic route
        res.redirect("/" + listName);
      });
    }
});


// POST handler for the "delete" route
app.post("/delete", function(req, res) {
  // Grab the checkbox clicked
  let checkedItemId = req.body.deleteItem;
  // Grab the list name for the dynamic route
  let listName = req.body.listName;

  // Check if the item is being removed from the root list
  if (listName === "Today") {
  // Find the item with a checked box via the item's id and remove it from the list
    Item.findByIdAndRemove(checkedItemId, function(err) {
      // Check if an error occurred
      if (err) {
        // Print the error to the console
        console.log(err);
      } else {
        // Print the message to confirm the item was deleted
        console.log("Succesfully deleted item with _id: " + checkedItemId);
        // Send the user back to the "to do" list
        res.redirect("/");
      }
    });
  } else {
    // Remove the item from a dynamic list
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
      // Check for errors
      if (err) {
        // Print the errors to the console
        console.log(err);
      } else {
          // Redirect to the dynamic route
          res.redirect("/" + listName);
      }
    });
  }
});



// Start server
app.listen(/*process.env.PORT*/3000, function() {
  console.log("Server is running on port 3000");
});
