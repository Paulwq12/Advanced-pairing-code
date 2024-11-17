const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

// Use process.cwd() to get the current directory path
const __path = process.cwd();

let server = require('./qr'),
    code = require('./pair');
let code = require('./pairing'); // Additional endpoint logic if required

require('events').EventEmitter.defaultMaxListeners = 500;

// Serve static files like CSS, JS, and images from the 'css' and 'js' directories
app.use('/css', express.static(__path + '/css'));
app.use('/js', express.static(__path + '/js'));

// Define routes
app.use('/qr', server);
app.use('/code', code);

// Route for pairing page
app.use('/pairing', async (req, res, next) => {
    res.sendFile(__path + '/pairing.html');
});

// Route for main page
app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
    console.log(`
Don't Forget To Give Star

Server running on http://localhost:` + PORT);
});

module.exports = app;
