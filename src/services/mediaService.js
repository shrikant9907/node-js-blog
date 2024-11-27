const Media = require("../models/mediaModel");
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Create a new media record
const createMedia = async ({ filename, filepath, mimetype, size }) => {
  try {
    if (!filename || !filepath || !mimetype || !size) {
      logger.warn('Missing required fields for media creation');
      return { success: false, message: 'All media fields (filename, filepath, mimetype, size) are required', data: null };
    }

    const newMedia = new Media({
      filename,
      filepath,
      mimetype,
      size
    });

    const savedMedia = await newMedia.save();
    logger.info(`Media created successfully: ${savedMedia._id}`);
    return { success: true, message: 'Media created successfully', data: savedMedia };
  } catch (error) {
    logger.error('Error creating media:', error);
    return { success: false, message: 'Error creating media', data: error.message };
  }
};

// Get media by ID
const getMediaById = async (id) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid ID format', data: null };
    }

    const media = await Media.findById(id);
    if (!media) {
      logger.warn(`Media with ID ${id} not found`);
      return { success: false, message: 'Media not found', data: null };
    }

    logger.info(`Media with ID ${id} found`);
    return { success: true, message: 'Media found', data: media };
  } catch (error) {
    logger.error('Error fetching media by ID:', error);
    return { success: false, message: 'Error fetching media', data: error.message };
  }
};

// Delete media by ID and file from server
const deleteMedia = async (id) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid ID format', data: null };
    }

    const media = await Media.findById(id);
    if (!media) {
      logger.warn(`Media with ID ${id} not found for deletion`);
      return { success: false, message: 'Media not found', data: null };
    }

    // Delete media file from server
    const filePath = path.join(__dirname, '..', media.filepath);
    fs.unlink(filePath, async (unlinkErr) => {
      if (unlinkErr) {
        logger.error(`Failed to delete file at ${filePath}`);
        return { success: false, message: 'Failed to delete file from the system', data: unlinkErr.message };
      }

      // After deleting file, delete the media record from the database
      const deletedMedia = await Media.findByIdAndDelete(id);
      if (!deletedMedia) {
        logger.error(`Error deleting media with ID ${id}`);
        return { success: false, message: 'Failed to delete media record', data: null };
      }

      logger.info(`Media with ID ${id} deleted successfully`);
      return { success: true, message: 'Media deleted successfully', data: deletedMedia };
    });
  } catch (error) {
    logger.error('Error deleting media:', error);
    return { success: false, message: 'Error deleting media', data: error.message };
  }
};

// Update media record (e.g., update filename, mimetype, etc.)
const updateMedia = async (id, updateFields) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: 'Invalid ID format', data: null };
    }

    const updatedMedia = await Media.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

    if (!updatedMedia) {
      logger.warn(`Media with ID ${id} not found for update`);
      return { success: false, message: 'Media not found', data: null };
    }

    logger.info(`Media with ID ${id} updated successfully`);
    return { success: true, message: 'Media updated successfully', data: updatedMedia };
  } catch (error) {
    logger.error('Error updating media:', error);
    return { success: false, message: 'Error updating media', data: error.message };
  }
};

// Get all media files (optional pagination)
const getAllMedia = async (skip = 0, limit = 10) => {
  try {
    const mediaFiles = await Media.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort by creation date, descending

    logger.info('Media files fetched successfully');
    return { success: true, message: 'Media files fetched successfully', data: mediaFiles };
  } catch (error) {
    logger.error('Error fetching media files:', error);
    return { success: false, message: 'Error fetching media files', data: error.message };
  }
};

// Get total media count for pagination
const getTotalMediaCount = async () => {
  try {
    const count = await Media.countDocuments();
    logger.info('Total media count fetched successfully');
    return { success: true, message: 'Total media count fetched successfully', data: count };
  } catch (error) {
    logger.error('Error fetching media count:', error);
    return { success: false, message: 'Error fetching media count', data: error.message };
  }
};

module.exports = {
  createMedia,
  getMediaById,
  deleteMedia,
  updateMedia,
  getAllMedia,
  getTotalMediaCount,
};
