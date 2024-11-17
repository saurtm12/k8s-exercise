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
const postGreService = process.env.POSTGRES_SERVICE || "localhost";
const dbUser = process.env.POSTGRES_USER || "myuser";
const dbPassword = process.env.POSTGRES_PASSWORD || "mypassword";
const dbDatabase = process.env.POSTGRES_DB || "mydatabase";

const client = new Client({
    user: dbUser, // PostgreSQL username
    host: postGreService, // Database host (use 'localhost' if connecting locally or your Kubernetes service IP if remote)
    database: dbDatabase, // Database name
    password: dbPassword, // PostgreSQL password
    port: 5432, // Default PostgreSQL port
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

app.put('/api/todos/:id', async (req, res) => {
  const todoId = req.params.id;

  if (!todoId || isNaN(todoId)) {
    return res.status(400).json({ error: 'Invalid todo ID' });
  }

  try {
    const result = await client.query(
      'UPDATE todos SET completed = TRUE WHERE id = $1 RETURNING *',
      [todoId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'TODO item not found' });
    }

    res.json({ message: 'TODO item marked as done', item: result.rows[0] });
  } catch (err) {
    console.error('Error updating TODO item:', err);
    res.status(500).json({ error: 'Could not mark the todo as done' });
  }
});

// Connect to the database
client.connect()
  .then(initializeDatabase)
  .then(() => {
    console.log('Connected to PostgreSQL')
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Connection error', err.stack)
    process.exit(1);
    throw err;
  });
// Start the server


async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      description TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE
    );
  `;
  try {
    await client.query(createTableQuery);
    console.log('Todos table is ready');
  } catch (err) {
    console.error('Error creating todos table:', err);
  }
}