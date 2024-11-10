// index.js
const express = require('express');
const app = express();
const fs = require("fs")
// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
const filePath = '/usr/src/app/files/timestamp.txt';




app.get('/', (req, res) => {
    res.send('Log App Hello World!');
});

app.get('/log', (req, res) => {
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        res.send(`${data.timestamp}: ${Math.random().toString(36).substring(2, 36)}
        Ping / Pongs: ${data.count}`)
    } else {
        res.send("Not found timestamp")
    }
    res.send(statusString);
});

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});