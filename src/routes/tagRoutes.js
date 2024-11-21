const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

// Get all tags
router.get('/', tagController.getAllTags);

// Create a new tag
router.post('/', tagController.createTag);

// Get tag by ID
router.get('/:id', tagController.getTagById);

// Update a tag by ID
router.put('/:id', tagController.updateTag);

// Delete a tag by ID
router.delete('/:id', tagController.deleteTag);

module.exports = router;
