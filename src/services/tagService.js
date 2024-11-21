const Tag = require("../models/tagModel");
const slugify = require('slugify');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// Get all tags with pagination
const getTagsWithPagination = async (skip, limit) => {
  try {
    const tags = await Tag.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort tags by creation date (descending)

    logger.info('Tags fetched successfully');
    return { success: true, message: 'Tags fetched successfully', data: tags };
  } catch (error) {
    logger.error('Error fetching tags:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching tags', data: error.message };
  }
};

// Get total number of tags for pagination
const getTotalTagsCount = async () => {
  try {
    const count = await Tag.countDocuments();
    logger.info('Total tags count fetched successfully');
    return { success: true, message: 'Total tags count fetched successfully', data: count };
  } catch (error) {
    logger.error('Error fetching tags count:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching tags count', data: error.message };
  }
};

// Create a new tag
const createTag = async ({ name }) => {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logger.warn('Tag name is required and should be a valid string');  // Log a warning if the name is invalid
      return { success: false, message: 'Tag name is required and should be a valid string', data: null };
    }

    // Check if a tag with the same name already exists
    const existingTag = await Tag.findOne({ name: name.trim() });
    if (existingTag) {
      logger.warn(`Tag already exists with the name ${name.trim()}`);  // Log a warning if tag already exists
      return { success: false, message: `Tag already exists with the name ${name.trim()}`, data: null };
    }

    let slug = slugify(name, { lower: true, strict: true });

    // Ensure slug is unique
    const existingSlugTag = await Tag.findOne({ slug });
    if (existingSlugTag) {
      slug = `${slug}-${Date.now()}`;  // Append timestamp to make it unique
    }

    const newTag = new Tag({
      name,
      slug,  // Automatically generated or unique slug
    });

    const savedTag = await newTag.save();
    logger.info(`Tag created successfully: ${savedTag._id}`);  // Log successful tag creation
    return { success: true, message: 'Tag created successfully', data: savedTag };
  } catch (error) {
    logger.error('Error creating tag:', error);  // Log the error using winston
    return { success: false, message: 'Error creating tag', data: error.message };
  }
};

// Get tag by ID
const getTagById = async (id) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }

    const tag = await Tag.findById(id);
    if (!tag) {
      logger.warn(`Tag with ID ${id} not found`);  // Log a warning if the tag is not found
      return { success: false, message: 'Tag not found', data: null };
    }
    logger.info(`Tag with ID ${id} found`);
    return { success: true, message: 'Tag found', data: tag };
  } catch (error) {
    logger.error('Error fetching tag by ID:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching tag', data: error.message };
  }
};

// Update an existing tag
const updateTag = async (id, { name }) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      logger.warn(`Tag with ID ${id} not found for update`);  // Log a warning if the tag isn't found
      return { success: false, message: 'Tag not found', data: null };
    }

    logger.info(`Tag with ID ${id} updated successfully`);  // Log successful tag update
    return { success: true, message: 'Tag updated successfully', data: updatedTag };
  } catch (error) {
    logger.error('Error updating tag:', error);  // Log the error using winston
    return { success: false, message: 'Error updating tag', data: error.message };
  }
};

// Delete a tag
const deleteTag = async (id) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      logger.warn(`Tag with ID ${id} not found for deletion`);  // Log a warning if the tag is not found
      return { success: false, message: 'Tag not found', data: null };
    }

    logger.info(`Tag with ID ${id} deleted successfully`);  // Log successful tag deletion
    return { success: true, message: 'Tag deleted successfully', data: deletedTag };
  } catch (error) {
    logger.error('Error deleting tag:', error);  // Log the error using winston
    return { success: false, message: 'Error deleting tag', data: error.message };
  }
};

module.exports = {
  getTagsWithPagination,
  getTotalTagsCount,
  createTag,
  getTagById,
  updateTag,
  deleteTag,
};
