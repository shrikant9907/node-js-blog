const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     tags: [Tags]
 *     summary: Retrieve all tags
 *     responses:
 *       200:
 *         description: List of all tags
 */
router.get('/', tagController.getAllTags);

/**
 * @swagger
 * /api/tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created successfully
 */
router.post('/', tagController.createTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Retrieve a tag by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single tag
 *       404:
 *         description: Tag not found
 */
router.get('/:id', tagController.getTagById);

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     tags: [Tags]
 *     summary: Update a tag by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the tag
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       404:
 *         description: Tag not found
 */
router.put('/:id', tagController.updateTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   patch:
 *     tags: [Tags]
 *     summary: Partially update a tag by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the tag
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag patched successfully
 *       404:
 *         description: Tag not found
 */
router.patch('/:id', tagController.patchTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete a tag by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 */
router.delete('/:id', tagController.deleteTag);

module.exports = router;
