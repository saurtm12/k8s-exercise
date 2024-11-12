// index.js
const express = require('express');
const app = express();
const fs = require("fs")
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const TODO_FILE = path.join(__dirname, "file" ,'todos.txt');

// Use PORT environment variable or default to 3000
const port = process.env.PORT || 3000;
app.use(cors({ origin: '*' }));

app.use(express.text());

app.post('/todos', (req, res) => {
  const todo = req.body;
  if (!todo) {
    return res.status(400).json({ error: 'Please provide a todo item' });
  }
  console.log(todo);

  // Write the TODO item to the file
  fs.appendFile(TODO_FILE, `${todo}\n`, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ error: 'Could not save the todo item' });
    }

    res.status(201).json({ message: 'TODO item added successfully' });
  });
});

app.get('/todos', (req, res) => {
  fs.readFile(TODO_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.status(200).json([]);
    }

    // Split the file content by lines and filter out any empty lines
    const todos = data.split('\n').filter(line => line.trim() !== '');
    res.json(todos);
  });
});


app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});