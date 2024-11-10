// index.js
const express = require('express');
const app = express();
const fs = require("fs");

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;


let n =0;

app.get('/pingpong', (req, res) => {
    n += 1;
    console.log(`URL: ${req.url}`)
    res.send(`Pong ${n}`);
});



const filePath = '/usr/src/app/files/timestamp.txt';
const write = () => {
    const timestamp = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify({
        timestamp: timestamp,
        count: n
    }));
    console.log(`Timestamp written: ${timestamp}`);
}
write();
setInterval(write, 5000); // Write every 5 seconds


// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});