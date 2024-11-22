const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

// Use process.cwd() to get the current directory path
const __path = process.cwd();

let qrRoute = require('./qr'); // QR code endpoint
let codeRoute = require('./pair'); // Additional endpoint logic if needed

require('events').EventEmitter.defaultMaxListeners = 500;

// Serve static files like CSS, JS, and images from the 'css' and 'js' directories
app.use('/css', express.static(__path + '/css'));
app.use('/js', express.static(__path + '/js'));

app.use('/pair',async (req, res, next) => {
res.sendFile(__path + '/pair.html')
})

// Route for pairing.html
app.get('/pairing', async (req, res) => {
    res.sendFile(__path + '/pairing.html'); // Serve pairing.html
});

// QR code data endpoint
app.use('/qr', qrRoute);

// Use body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the main page
app.get('/', async (req, res) => {
    res.sendFile(__path + '/main.html'); // Serve main.html
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:` + PORT);
});

module.exports = app;
