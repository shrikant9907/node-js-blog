const asyncHandler = require('express-async-handler');
const blogService = require('../services/blogService');

// Get all blogs
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogService.getAllBlogs();

  if (blogs.length === 0) {
    return res.status(200).json({ message: 'No blogs found', blogs: [] });
  }

  res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
});

// Create a new blog
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content, and author are required' });
  }

  const newBlog = await blogService.createBlog({ title, content, author });
  res.status(201).json({ message: 'Blog created successfully', newBlog });
});

// Update an existing blog
exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  const blog = await blogService.getBlogById(id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const updatedFields = {
    title: title || blog.title,
    content: content || blog.content,
    author: author || blog.author,
  };

  const updatedBlog = await blogService.updateBlog(id, updatedFields);

  res.status(200).json({
    message: 'Blog updated successfully',
    updatedBlog,
  });
});

// Partially update a blog
exports.patchBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  const blog = await blogService.getBlogById(id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (content) updatedFields.content = content;
  if (author) updatedFields.author = author;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  const updatedBlog = await blogService.updateBlog(id, updatedFields);

  res.status(200).json({
    message: 'Blog updated successfully',
    updatedBlog,
  });
});

// Delete a blog
exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await blogService.getBlogById(id);

  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  await blogService.deleteBlog(id);
  res.status(200).json({ message: 'Blog deleted successfully' });
});
