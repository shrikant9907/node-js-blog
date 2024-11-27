const express = require('express');
const upload = require('../utils/multer');
const mediaController = require('../controllers/mediaController');

const router = express.Router();

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     tags: [Media]
 *     summary: Upload a media file (image)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad Request (invalid file format or file size exceeded)
 */
router.post('/upload', upload.single('image'), mediaController.uploadMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     tags: [Media]
 *     summary: Retrieve a media file by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the media file
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single media file
 *       404:
 *         description: Media file not found
 */
router.get('/:id', mediaController.getMediaById);

/**
 * @swagger
 * /api/media:
 *   get:
 *     tags: [Media]
 *     summary: Retrieve all media files
 *     responses:
 *       200:
 *         description: A list of media files
 *       500:
 *         description: Server error (couldn't retrieve media)
 */
router.get('/', mediaController.getAllMedia);  // New route to get all media

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     tags: [Media]
 *     summary: Delete a media file by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the media file to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media file deleted successfully
 *       404:
 *         description: Media file not found
 */
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
