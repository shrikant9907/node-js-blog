const asyncHandler = require('express-async-handler');
const tagService = require('../services/tagService');

// Get all tags
exports.getAllTags = asyncHandler(async (req, res) => {
  const tags = await tagService.getAllTags();

  if (tags.length === 0) {
    return res.status(200).json({ message: 'No tags found', tags: [] });
  }

  res.status(200).json({ message: 'Tags retrieved successfully', tags });
});

// Create a new tag
exports.createTag = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  const newTag = await tagService.createTag({ name });
  res.status(201).json({ message: 'Tag created successfully', newTag });
});

// Update an existing tag
exports.updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const tag = await tagService.getTagById(id);

  if (!tag) {
    return res.status(404).json({ message: 'Tag not found' });
  }

  const updatedFields = { name: name || tag.name };

  const updatedTag = await tagService.updateTag(id, updatedFields);

  res.status(200).json({
    message: 'Tag updated successfully',
    updatedTag,
  });
});

// Partially update a tag
exports.patchTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const tag = await tagService.getTagById(id);

  if (!tag) {
    return res.status(404).json({ message: 'Tag not found' });
  }

  const updatedFields = {};

  if (name) updatedFields.name = name;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  const updatedTag = await tagService.updateTag(id, updatedFields);

  res.status(200).json({
    message: 'Tag updated successfully',
    updatedTag,
  });
});

// Delete a tag
exports.deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await tagService.getTagById(id);

  if (!tag) {
    return res.status(404).json({ message: 'Tag not found' });
  }

  await tagService.deleteTag(id);
  res.status(200).json({ message: 'Tag deleted successfully' });
});
