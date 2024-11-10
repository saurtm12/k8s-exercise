// index.js
const express = require('express');
const app = express();

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;

let statusString;
const getHashNow = () => {
    const randomhash = Math.random().toString(36).substring(2, 36)
    return randomhash
}

const print = () => {
    const timestamp = new Date().toISOString()
    statusString = timestamp + ' ' + getHashNow()
    console.log(statusString);
}

print()
setInterval(print, 5000)


app.get('/', (req, res) => {
    res.send('App Hello World!');
});

app.get('/status', (req, res) => {
    res.send(statusString);
});

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});