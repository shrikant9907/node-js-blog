const Todo = require('../models/todoModel');

exports.getAllTodos = async () => {
  return await Todo.find();
};

exports.createTodo = async ({ title, description }) => {
  const newTodo = new Todo({ title, description });
  return await newTodo.save();
};

exports.getTodoById = async (id) => {
  return await Todo.findById(id);
};

exports.updateTodo = async (id, { title, description, completed }) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true, runValidators: true }
  );
  if (!updatedTodo) {
    throw new Error('Todo not found');
  }
  return updatedTodo;
};

exports.patchTodo = async (id, updateFields) => {
  const todo = await Todo.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
  return todo;
};

exports.deleteTodo = async (id) => {
  const deletedTodo = await Todo.findByIdAndDelete(id);
  if (!deletedTodo) {
    throw new Error('Todo not found');
  }
};
