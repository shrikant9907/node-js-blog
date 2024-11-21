const asyncHandler = require('express-async-handler');
const pageService = require('../services/pageService');

// Get all pages
exports.getAllPages = asyncHandler(async (req, res) => {
  const pages = await pageService.getAllPages();

  if (pages.length === 0) {
    return res.status(200).json({ message: 'No pages found', pages: [] });
  }

  res.status(200).json({ message: 'Pages retrieved successfully', pages });
});

// Create a new page
exports.createPage = asyncHandler(async (req, res) => {
  const { title, content, slug, metaDescription } = req.body;

  if (!title || !content || !slug) {
    return res.status(400).json({ message: 'Title, content, and slug are required' });
  }

  const newPage = await pageService.createPage({ title, content, slug, metaDescription });
  res.status(201).json({ message: 'Page created successfully', newPage });
});

// Update an existing page
exports.updatePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, slug, metaDescription } = req.body;

  const page = await pageService.getPageById(id);

  if (!page) {
    return res.status(404).json({ message: 'Page not found' });
  }

  const updatedFields = {
    title: title || page.title,
    content: content || page.content,
    slug: slug || page.slug,
    metaDescription: metaDescription || page.metaDescription,
  };

  const updatedPage = await pageService.updatePage(id, updatedFields);

  res.status(200).json({
    message: 'Page updated successfully',
    updatedPage,
  });
});

// Partially update a page
exports.patchPage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, slug, metaDescription } = req.body;

  const page = await pageService.getPageById(id);

  if (!page) {
    return res.status(404).json({ message: 'Page not found' });
  }

  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (content) updatedFields.content = content;
  if (slug) updatedFields.slug = slug;
  if (metaDescription) updatedFields.metaDescription = metaDescription;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  const updatedPage = await pageService.updatePage(id, updatedFields);

  res.status(200).json({
    message: 'Page updated successfully',
    updatedPage,
  });
});

// Delete a page
exports.deletePage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await pageService.getPageById(id);

  if (!page) {
    return res.status(404).json({ message: 'Page not found' });
  }

  await pageService.deletePage(id);
  res.status(200).json({ message: 'Page deleted successfully' });
});
