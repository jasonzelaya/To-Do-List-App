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
let itemsList = ['Item 1', 'Item 2', 'Item 3'];
// -------------------ITEMS LIST-----------------------
// Get handler
app.get('/', function(req, res) {

  let today = date.currentDate();

  res.render('index', {newDate: today, newItem: itemsList});

});


app.post('/', function(req, res) {
  // console.log(req.body);
  let item = req.body.item;

  itemsList.push(item);
  res.redirect('/');
});


// --------------------WORK LIST-----------------------

app.get('/work', function(req, res) {
  let today = date.currentDate();
  res.render('/work', {newDate: 'Work Day', newItem: itemsList});
});




// Start server
app.listen(/*process.env.PORT*/3000, function() {
  console.log("Server is running on port 3000");
});
