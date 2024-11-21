const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

// Get all todos
router.get('/', todoController.getAllTodos);

// Create a new todo
router.post('/', todoController.createTodo);

// Update a todo by id (Full update)
router.put('/:id', todoController.updateTodo);

// Partially update a todo by id (PATCH route)
router.patch('/:id', todoController.patchTodo);

// Delete a todo by id
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
