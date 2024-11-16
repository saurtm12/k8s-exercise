const express = require('express');
const app = express();
const { Client } = require('pg');
const path = require('path');
const cors = require('cors');

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
app.use(cors({ origin: '*' }));
app.use(express.text());

// Set up PostgreSQL client
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

// Connect to the database
client.connect()
  .then(initializeDatabase)
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
    console.error('Connection error', err.stack)
    throw err;
  });

// Endpoint to add a new TODO
app.post('/api/todos', async (req, res) => {
  const todo = req.body;

  
  if (!todo) {
    return res.status(400).json({ error: 'Please provide a todo item' });
  }

  if (todo.length > 140) {
    console.log("TODO too long");
    res.status(400).json({ error: 'Too long TODO' });
    return
  }

  try {
    const result = await client.query('INSERT INTO todos (description) VALUES ($1) RETURNING *', [todo]);
    res.status(201).json({ message: 'TODO item added successfully', item: result.rows[0] });
  } catch (err) {
    console.error('Error saving to database:', err);
    res.status(500).json({ error: 'Could not save the todo item' });
  }
});

// Endpoint to get all TODOs
app.get('/api/todos', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM todos');
    const todos = result.rows.map(row => row.description);
    res.json(todos);
  } catch (err) {
    console.error('Error reading from database:', err);
    res.status(500).json({ error: 'Could not retrieve todo items' });
  }
});
app.get("/", (_, res) => {
  return res.send("Hello From todo backend");
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL
    );
  `;
  try {
    await client.query(createTableQuery);
    console.log('Todos table is ready');
  } catch (err) {
    console.error('Error creating todos table:', err);
  }
}