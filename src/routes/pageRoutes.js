const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

// Get all pages
router.get('/', pageController.getAllPages);

// Create a new page
router.post('/', pageController.createPage);

// Get page by ID
router.get('/:id', pageController.getPageById);

// Update a page by ID
router.put('/:id', pageController.updatePage);

// Delete a page by ID
router.delete('/:id', pageController.deletePage);

module.exports = router;
