// index.js
const express = require('express');
const app = express();

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});