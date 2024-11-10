// index.js
const express = require('express');
const app = express();

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;


let n =0;

app.get('/pingpong', (req, res) => {
    n += 1;
    console.log(`URL: ${req.url}`)
    res.send(`Pong ${n}`);
});


// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});