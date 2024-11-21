const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Get all blog posts
router.get('/', blogController.getAllPosts);

// Create a new blog post
router.post('/', blogController.createPost);

// Get blog post by ID
router.get('/:id', blogController.getPostById);

// Update a blog post by ID (Full update)
router.put('/:id', blogController.updatePost);

// Partially update a blog post by ID (PATCH route)
router.patch('/:id', blogController.patchPost);

// Delete a blog post by ID
router.delete('/:id', blogController.deletePost);

module.exports = router;
