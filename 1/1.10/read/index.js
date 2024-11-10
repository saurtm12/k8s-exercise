// index.js
const express = require('express');
const app = express();
const fs = require('fs');

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
const filePath = '/usr/src/app/files/timestamp.txt';

app.get('/timestamp', (req, res) => {
    if (fs.existsSync(filePath)) {
        const timestamp = fs.readFileSync(filePath, 'utf-8');
        res.send(timestamp + ":" + Math.random().toString(36).substring(2, 36))
    } else {
        res.send("Not found timestamp")
    }
});

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});