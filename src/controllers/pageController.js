const asyncHandler = require('express-async-handler');
const pageService = require('../services/pageService');

// Get all pages with pagination
const getAllPages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query; // Default to page 1, limit 20
  const skip = (page - 1) * limit;

  // Call service to get pages with pagination
  const result = await pageService.getPagesWithPagination(skip, limit);

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  // Call service to get total pages count
  const totalPagesResult = await pageService.getTotalPagesCount();

  if (!totalPagesResult.success) {
    return res.status(500).json({ message: totalPagesResult.message });
  }

  // Return paginated pages with total count
  res.status(200).json({
    message: 'Pages retrieved successfully',
    pages: result.data,
    totalPages: totalPagesResult.data,
    currentPage: page,
    totalPages: Math.ceil(totalPagesResult.data / limit),
  });
});

// Create a new page
const createPage = asyncHandler(async (req, res) => {
  const { title, content, metaDescription } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  // Call service to create a new page
  const result = await pageService.createPage({ title, content, metaDescription });

  if (!result.success) {
    return res.status(400).json({ message: result.message, page: result?.data });
  }

  // Return success response with newly created page
  res.status(201).json({
    message: 'Page created successfully',
    newPage: result.data,
  });
});

// Get page by ID
const getPageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get page by ID
  const result = await pageService.getPageById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Return success response with page data
  res.status(200).json({
    message: 'Page retrieved successfully',
    page: result.data,
  });
});

// Update an existing page
const updatePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, metaDescription } = req.body;

  // Call service to get page by ID
  const result = await pageService.getPageById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  const updatedFields = {
    title: title || result.data.title,
    content: content || result.data.content,
    metaDescription: metaDescription || result.data.metaDescription,
  };

  // Call service to update page
  const updateResult = await pageService.updatePage(id, updatedFields);

  if (!updateResult.success) {
    return res.status(500).json({ message: updateResult.message });
  }

  // Return success response with updated page
  res.status(200).json({
    message: 'Page updated successfully',
    updatedPage: updateResult.data,
  });
});

// Partially update a page
const patchPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, metaDescription } = req.body;

  // Call service to get page by ID
  const result = await pageService.getPageById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (content) updatedFields.content = content;
  if (metaDescription) updatedFields.metaDescription = metaDescription;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  // Call service to update page
  const updateResult = await pageService.updatePage(id, updatedFields);

  if (!updateResult.success) {
    return res.status(500).json({ message: updateResult.message });
  }

  // Return success response with partially updated page
  res.status(200).json({
    message: 'Page partially updated successfully',
    updatedPage: updateResult.data,
  });
});

// Delete a page
const deletePage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get page by ID
  const result = await pageService.getPageById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Call service to delete page
  const deleteResult = await pageService.deletePage(id);

  if (!deleteResult.success) {
    return res.status(500).json({ message: deleteResult.message });
  }

  // Return success response after deletion
  res.status(200).json({ message: 'Page deleted successfully' });
});

module.exports = {
  getAllPages,
  createPage,
  getPageById,
  updatePage,
  patchPage,
  deletePage,
};
