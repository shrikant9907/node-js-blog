const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Get all categories
router.get('/', categoryController.getAllCategories);

// Create a new category
router.post('/', categoryController.createCategory);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Update a category by ID
router.put('/:id', categoryController.updateCategory);

// Route for patching a category by ID
router.patch('/:id', categoryController.patchCategory);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
