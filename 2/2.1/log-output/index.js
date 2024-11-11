// index.js
const { default: axios } = require('axios');
const express = require('express');
const app = express();

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
const PINGPONG_SERVICE = process.env.PINGPONG_SERVICE || "http://localhost:3003";



app.get('/', (req, res) => {
    res.send('Log App Hello World!');
});

app.get('/log', async (req, res) => {
    const upStreamRes = await axios.get(`${PINGPONG_SERVICE}/info`)
    const data = upStreamRes.data;
    res.send(`${data.timestamp}: ${Math.random().toString(36).substring(2, 36)}
    Ping / Pongs: ${data.count}`)
});

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});