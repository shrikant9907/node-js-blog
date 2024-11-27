const asyncHandler = require('express-async-handler');
const mediaService = require('../services/mediaService');
const path = require('path');
const fs = require('fs');

// Upload a media file (image)
const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Create media object to save in the database (optional)
  const mediaData = {
    filename: req.file.filename,
    filepath: path.join('uploads', 'images', req.file.filename),
    mimetype: req.file.mimetype,
    size: req.file.size,
  };

  // Call service to store the media data (you can also store additional metadata in the database)
  const result = await mediaService.createMedia(mediaData);

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  // Return success response with media info
  res.status(201).json({
    message: 'File uploaded successfully',
    media: result.data,
  });
});

// Get all media files
const getAllMedia = asyncHandler(async (req, res) => {
  // Call service to get all media
  const result = await mediaService.getAllMedia();

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  // Return success response with all media
  res.status(200).json({
    message: 'All media files retrieved successfully',
    media: result.data,
  });
});

// Get media by ID
const getMediaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get media by ID
  const result = await mediaService.getMediaById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Return success response with media data
  res.status(200).json({
    message: 'Media retrieved successfully',
    media: result.data,
  });
});

// Delete media by ID
const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get media by ID
  const result = await mediaService.getMediaById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Delete media file from the server
  const filePath = path.join(__dirname, '..', result.data.filepath);

  fs.unlink(filePath, async (unlinkErr) => {
    if (unlinkErr) {
      return res.status(500).json({ message: 'Failed to delete the file from the system' });
    }

    // Call service to delete media record from the database
    const deleteResult = await mediaService.deleteMedia(id);

    if (!deleteResult.success) {
      return res.status(500).json({ message: deleteResult.message });
    }

    res.status(200).json({
      message: 'Media file deleted successfully',
    });
  });
});

module.exports = {
  uploadMedia,
  getAllMedia,  // Exporting the new method
  getMediaById,
  deleteMedia,
};
