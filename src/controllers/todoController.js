const asyncHandler = require('express-async-handler');
const todoService = require('../services/todoService');

// Wrap route handlers with express-async-handler
exports.getAllTodos = asyncHandler(async (req, res) => {
  const todos = await todoService.getAllTodos();

  if (todos.length === 0) {
    return res.status(200).json({ message: 'No todos found', todos: [] });
  }

  res.status(200).json({ message: 'Todos retrieved successfully', todos });
});

exports.createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Check for missing fields
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newTodo = await todoService.createTodo({ title, description });
  res.status(201).json({ message: 'Todo created successfully', newTodo });
});

exports.updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Check if the todo item exists
  const todo = await todoService.getTodoById(id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }

  // Prepare updated fields, keeping existing fields if not provided
  const updatedFields = {
    title: title || todo.title,
    description: description || todo.description,
    completed: completed !== undefined ? completed : todo.completed, // If completed is not provided, keep the current value
  };

  // Update the todo item
  const updatedTodo = await todoService.updateTodo(id, updatedFields);

  res.status(200).json({
    message: 'Todo item updated successfully',
    updatedTodo,
  });
});

exports.patchTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Check if the todo item exists
  const todo = await todoService.getTodoById(id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }

  // Prepare updated fields, only update the fields that are provided
  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (completed !== undefined) updatedFields.completed = completed;

  // If no valid fields are provided, return an error
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  // Update the todo item
  const updatedTodo = await todoService.updateTodo(id, updatedFields);

  res.status(200).json({
    message: 'Todo item updated successfully',
    updatedTodo,
  });
});


exports.deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the todo item exists
  const todo = await todoService.getTodoById(id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo item not found' });
  }

  // Delete the todo item
  await todoService.deleteTodo(id);
  res.status(200).json({ message: 'Todo item deleted successfully' });
});

