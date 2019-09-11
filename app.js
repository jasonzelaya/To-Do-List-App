// Incorporate modules
const express = require('express');
const bodyParser = require('body-parser');
// My custom module
const date = require(__dirname + '/date.js');


// Initiate app
const app = express();

// Use EJS
app.set('view engine', 'ejs');

// Enable use of body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Serve static files in "public" directory
app.use(express.static('public'));



// ----------------Global Variables--------------------

// Create an array to put the root's items in
let itemsList = ['Item 1', 'Item 2', 'Item 3'];
// Create an array to put the work page's items in
let workList = [];

// -------------------ITEMS LIST-----------------------
// Get handler for the root list
app.get('/', function(req, res) {
  // Get today's date
  let today = date.currentDate();
  // Pass values into index.ejs variables
  res.render('index', {newDate: today, newItem: itemsList});

});

// Post handler
app.post('/', function(req, res) {
  // console.log(req.body);
  // Grab the new item value the user entered
  let item = req.body.item;
  // If the title of the page is "Work Day"
  if (item === "Work Day") {
    // Add the item to the Work Day list
    workList.push(item);
    // Then return to the root
    res.redirect('/work')
  } else {
   // Add the new value to the root's list
  itemsList.push(item);
  // Return to the root
  res.redirect('/');
  }

});


// --------------------WORK LIST-----------------------

// Get handler for the "work" list
app.get('/work', function(req, res) {
  // Get today's date
  let today = date.currentDate();
  // Render the "work" page with an updated list from the root's post handler"
  res.render('/work', {newDate: 'Work Day', newItem: itemsList});
});

// Post handler for the "work" page
app.post('/work', function(req, res) {
  // Grab the new item value the user entered
  let newItem = req.body.item;
  // Add the new item to the "Work Day" list
  workList.push(newItem);
  // Return to the root
  redirect('/');
});








// Start server
app.listen(/*process.env.PORT*/3000, function() {
  console.log("Server is running on port 3000");
});
