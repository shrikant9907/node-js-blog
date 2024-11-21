const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all post posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of post posts
 */
router.get('/', postController.getAllPosts);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post post
 *     tags: [Posts]
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
 *     responses:
 *       201:
 *         description: Post post created
 */
router.post('/', postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post post found
 *       404:
 *         description: Post post not found
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post post by ID (Full update)
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post post to update
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
 *     responses:
 *       200:
 *         description: Post post updated
 *       404:
 *         description: Post post not found
 */
router.put('/:id', postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Partially update a post post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post post to partially update
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
 *     responses:
 *       200:
 *         description: Post post partially updated
 *       404:
 *         description: Post post not found
 */
router.patch('/:id', postController.patchPost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post post to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post post deleted
 *       404:
 *         description: Post post not found
 */
router.delete('/:id', postController.deletePost);

module.exports = router;
