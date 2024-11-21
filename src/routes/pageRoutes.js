const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

/**
 * @swagger
 * /api/pages:
 *   get:
 *     tags: [Pages] 
 *     summary: Retrieve all pages
 *     responses:
 *       200:
 *         description: List of all pages
 */
router.get('/', pageController.getAllPages);

/**
 * @swagger
 * /api/pages:
 *   post:
 *     tags: [Pages] 
 *     summary: Create a new page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Page created successfully
 */
router.post('/', pageController.createPage);

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     tags: [Pages] 
 *     summary: Retrieve a page by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the page
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single page
 *       404:
 *         description: Page not found
 */
router.get('/:id', pageController.getPageById);

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     tags: [Pages] 
 *     summary: Update a page by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the page
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       404:
 *         description: Page not found
 */
router.put('/:id', pageController.updatePage);

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     tags: [Pages] 
 *     summary: Delete a page by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the page
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       404:
 *         description: Page not found
 */
router.delete('/:id', pageController.deletePage);

module.exports = router;
