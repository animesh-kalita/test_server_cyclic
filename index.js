const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const PORT = 3500;

app.use(express.json());

let todos = [
   
];

// Middleware to load todos from file
const loadTodos = async (req, res, next) => {
    try {
      const data = await fs.readFile(path.join(__dirname, 'todos.json'), 'utf8');
      todos = JSON.parse(data);
      console.log('Loaded todos:', todos);
    } catch (error) {
      console.error('Error loading todos:', error);
      // If file doesn't exist, start with an empty array
      todos = [];
    }
    next();
  };
  

app.use(loadTodos);

// Endpoints...

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const newTodo = { id: todos.length + 1, text, done: false };
  todos.push(newTodo);
  await saveTodos();
  res.status(201).json(newTodo);
});

// Update, Delete, and other endpoints...

const saveTodos = async () => {
  await fs.writeFile(path.join(__dirname, 'todos.json'), JSON.stringify(todos, null, 2));
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
