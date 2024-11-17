// index.js
const { default: axios } = require('axios');
const express = require('express');
const fs = require('fs');
const app = express();

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
const PINGPONG_SERVICE = process.env.PINGPONG_SERVICE || "http://localhost:3003";


app.use((req, res, next) => {
    console.log(`Request Path: ${req.path}`);
    next(); // Pass control to the next middleware or route handler
    });
    
app.get('/', (req, res) => {
    res.send('Log App Hello World!');
});

app.get('/log', async (req, res) => {
    try {
        const upStreamRes = await axios.get(`${PINGPONG_SERVICE}/pingpong/info`)
        const data = upStreamRes.data;
        res.send(`file content: ${fs.readFileSync("/etc/config/text.txt", 'utf8')}
        env variable: MESSAGE=${process.env.MESSAGE}
        ${data.timestamp}: ${Math.random().toString(36).substring(2, 36)}
        Ping / Pongs: ${data.count}`)
    }
    catch (e) {
        console.log(e);
    }
});

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});