const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

// Use process.cwd() to get the current directory path
const __path = process.cwd();

let server = require('./qr'); // Endpoint for serving QR code data
let code = require('./pair'); // Additional endpoint logic if required

require('events').EventEmitter.defaultMaxListeners = 500;

// Serve static files like CSS, JS, and images from the 'css' and 'js' directories
app.use('/css', express.static(__path + '/css'));
app.use('/js', express.static(__path + '/js'));

// Route for pairing page (pair.html)
app.get('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html'); // Serve the pairing page
});

// Route for serving QR code as JSON data
app.use('/qr', server);

// Route for main page
app.get('/', async (req, res, next) => {
    res.sendFile(__path + '/main.html'); // Serve the main page
});

// Use body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server
app.listen(PORT, () => {
    console.log(`
Don't Forget To Give Star

Server running on http://localhost:` + PORT);
});

module.exports = app;
