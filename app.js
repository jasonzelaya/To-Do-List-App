// Incorporate modules
const express = require('express');
const bodyParser = require('body-parser');

// Initiate app
const app = express();

// Enable use of body-parser
app.use(bodyParser.urlencoded({extended: true}));
// Serve static files in "public" directory
app.use(express.static('public'));

// Use EJS
app.set('view engine', 'ejs');

// ----------------Global Variables--------------------
let itemsList = [];
// -------------------ITEMS LIST-----------------------
// Get handler
app.get('/', function(req, res) {
  // Get today's date
  let newDate = new Date();
  // Specify the desired date format for the title of the page
  let options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };

  // Return the date as a string
  let today = newDate.toLocaleDateString('en-US', options);

  res.render('index', {newDate: today, newItem: itemsList});

});


app.post('/', function(req, res) {
  let enteredItem = req.body.enteredItem;
  itemsList.push(enteredItem);
  res.redirect('/');
});








// Start server
app.listen(/*process.env.PORT*/3000, function() {
  console.log("Server is running on port 3000");
});
