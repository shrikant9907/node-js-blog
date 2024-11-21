const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
    versionKey: false // Disables `__v` versioning field
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
