// index.js
const express = require('express');
const app = express();

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;

let n =0;
let timestamp;
app.get('/pingpong', (req, res) => {
    n += 1;
    console.log(`URL: ${req.url}`)
    res.send(`Pong ${n}`);
});

app.get("/info", (_, res) => {
    res.send(JSON.stringify({
        timestamp: timestamp,
        count: n
    }))
})

const changeTimeStamp = () => {
    timestamp = new Date().toISOString();
}
changeTimeStamp();
setInterval(changeTimeStamp, 5000); // Write every 5 seconds


// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});