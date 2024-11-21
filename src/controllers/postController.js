const asyncHandler = require('express-async-handler');
const postService = require('../services/postService');

// Get all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 10 } = req.query;

  const postsResponse = await postService.getAllPosts(parseInt(skip), parseInt(limit));

  if (!postsResponse.success) {
    return res.status(500).json({ message: postsResponse.message });
  }

  if (postsResponse.data.length === 0) {
    return res.status(200).json({ message: 'No posts found', posts: [] });
  }

  res.status(200).json({ message: postsResponse.message, posts: postsResponse.data });
});

// Get post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Extract the post ID from the request parameters

  const postResponse = await postService.getPostById(id);

  // Dynamically set the status code based on the response from the service
  return res.status(postResponse.statusCode).json({
    message: postResponse.message,
    post: postResponse.data || null,  // Include post data if found, otherwise null
  });
});

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content, and author are required' });
  }

  const postResponse = await postService.createPost({ title, content, author });

  // Check if the post creation failed due to conflict (409)
  if (!postResponse.success && postResponse.statusCode === 409) {
    return res.status(409).json({ message: postResponse.message });  // Conflict status code
  }

  // Handle other errors (internal server error)
  if (!postResponse.success) {
    return res.status(500).json({ message: postResponse.message });
  }

  // Successful post creation
  res.status(201).json({ message: postResponse.message, newPost: postResponse.data });
});

// Update an existing post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  const postResponse = await postService.getPostById(id);

  if (!postResponse.success) {
    return res.status(404).json({ message: postResponse.message });
  }

  const updatedFields = {
    title: title || postResponse.data.title,
    content: content || postResponse.data.content,
    author: author || postResponse.data.author,
  };

  const updateResponse = await postService.updatePost(id, updatedFields);

  if (!updateResponse.success) {
    return res.status(500).json({ message: updateResponse.message });
  }

  res.status(200).json({
    message: updateResponse.message,
    updatedPost: updateResponse.data,
  });
});

// Partially update a post
const patchPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  const postResponse = await postService.getPostById(id);

  if (!postResponse.success) {
    return res.status(404).json({ message: postResponse.message });
  }

  const updatedFields = {};

  if (title) updatedFields.title = title;
  if (content) updatedFields.content = content;
  if (author) updatedFields.author = author;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  const patchResponse = await postService.patchPost(id, updatedFields);

  if (!patchResponse.success) {
    return res.status(500).json({ message: patchResponse.message });
  }

  res.status(200).json({
    message: patchResponse.message,
    updatedPost: patchResponse.data,
  });
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const postResponse = await postService.getPostById(id);

  if (!postResponse.success) {
    return res.status(404).json({ message: postResponse.message });
  }

  const deleteResponse = await postService.deletePost(id);

  if (!deleteResponse.success) {
    return res.status(500).json({ message: deleteResponse.message });
  }

  res.status(200).json({ message: deleteResponse.message });
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  patchPost,
  deletePost,
};
