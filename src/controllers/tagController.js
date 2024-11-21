const asyncHandler = require('express-async-handler');
const tagService = require('../services/tagService');

// Get all tags with pagination
const getAllTags = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query; // Default to page 1, limit 20
  const skip = (page - 1) * limit;

  // Call service to get tags with pagination
  const result = await tagService.getTagsWithPagination(skip, limit);

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  // Call service to get total tags count
  const totalTagsResult = await tagService.getTotalTagsCount();

  if (!totalTagsResult.success) {
    return res.status(500).json({ message: totalTagsResult.message });
  }

  // Return paginated tags with total count
  res.status(200).json({
    message: 'Tags retrieved successfully',
    tags: result.data,
    totalTags: totalTagsResult.data,
    currentPage: page,
    totalPages: Math.ceil(totalTagsResult.data / limit),
  });
});

// Create a new tag
const createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  // Call service to create a new tag
  const result = await tagService.createTag({ name });

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  // Return success response with newly created tag
  res.status(201).json({
    message: 'Tag created successfully',
    newTag: result.data,
  });
});

// Get tag by ID
const getTagById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get tag by ID
  const result = await tagService.getTagById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Return success response with tag data
  res.status(200).json({
    message: 'Tag retrieved successfully',
    tag: result.data,
  });
});

// Update an existing tag
const updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Call service to get tag by ID
  const result = await tagService.getTagById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  const updatedFields = {
    name: name || result.data.name,
  };

  // Call service to update tag
  const updateResult = await tagService.updateTag(id, updatedFields);

  if (!updateResult.success) {
    return res.status(500).json({ message: updateResult.message });
  }

  // Return success response with updated tag
  res.status(200).json({
    message: 'Tag updated successfully',
    updatedTag: updateResult.data,
  });
});

// Partially update a tag
const patchTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Call service to get tag by ID
  const result = await tagService.getTagById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  const updatedFields = {};

  if (name) updatedFields.name = name;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  // Call service to update tag
  const updateResult = await tagService.updateTag(id, updatedFields);

  if (!updateResult.success) {
    return res.status(500).json({ message: updateResult.message });
  }

  // Return success response with partially updated tag
  res.status(200).json({
    message: 'Tag partially updated successfully',
    updatedTag: updateResult.data,
  });
});

// Delete a tag
const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get tag by ID
  const result = await tagService.getTagById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Call service to delete tag
  const deleteResult = await tagService.deleteTag(id);

  if (!deleteResult.success) {
    return res.status(500).json({ message: deleteResult.message });
  }

  // Return success response after deletion
  res.status(200).json({ message: 'Tag deleted successfully' });
});

module.exports = {
  getAllTags,
  createTag,
  getTagById,
  updateTag,
  patchTag,
  deleteTag,
};
