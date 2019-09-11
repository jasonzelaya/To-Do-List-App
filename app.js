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













// Start server
app.listen(/*process.env.PORT*/3000, function() {
  console.log("Server is running on port 3000");
});
