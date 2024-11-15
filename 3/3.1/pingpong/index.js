// index.js
const express = require('express');
const app = express();
const { Client } = require('pg');

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
const postGreService = process.env.POSTGRES_SERVICE;
const dbUser = process.env.POSTGRES_USER;
const dbPassword = process.env.POSTGRES_PASSWORD;
const dbDatabase = process.env.POSTGRES_DB;

const client = new Client({
    user: dbUser, // PostgreSQL username
    host: postGreService, // Database host (use 'localhost' if connecting locally or your Kubernetes service IP if remote)
    database: dbDatabase, // Database name
    password: dbPassword, // PostgreSQL password
    port: 5432, // Default PostgreSQL port
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .then(() => client.query(`
        CREATE TABLE IF NOT EXISTS counter_table (
            id SERIAL PRIMARY KEY,
            counter_value INTEGER NOT NULL DEFAULT 0
        );

        INSERT INTO counter_table (id, counter_value)
        VALUES (1, 0)
        ON CONFLICT (id) DO NOTHING;
    `))
    .catch(err => console.error('Connection error', err.stack));

let timestamp;

app.get('/pingpong', async (req, res) => {
    try {
        await client.query('UPDATE counter_table SET counter_value = counter_value + 1 WHERE id = 1');
        const result = await client.query('SELECT counter_value FROM counter_table WHERE id = 1');
        const counterValue = result.rows[0].counter_value;
        console.log(`URL: ${req.url}`);
        res.send(`Pong ${counterValue}`);
    } catch (err) {
        console.error('Database error', err.stack);
        res.status(500).send('Error updating counter');
    }
});

app.get("/info", async (_, res) => {
    try {
        const result = await client.query('SELECT counter_value FROM counter_table WHERE id = 1');
        const counterValue = result.rows[0].counter_value;
        res.send(JSON.stringify({
            timestamp: timestamp,
            count: counterValue
        }));
    } catch (err) {
        console.error('Database error', err.stack);
        res.status(500).send('Error retrieving info');
    }
});

const changeTimeStamp = () => {
    timestamp = new Date().toISOString();
};
changeTimeStamp();
setInterval(changeTimeStamp, 5000); // Write every 5 seconds

// Start the server and log the port
app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});
