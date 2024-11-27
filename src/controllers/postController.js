const asyncHandler = require('express-async-handler');
const postService = require('../services/postService');
const { StatusCodes } = require('http-status-codes');
const { validateObjectId, sendResponse } = require('../utils/helper');

// Get all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 10 } = req.query;

  const postsResponse = await postService.getAllPosts(parseInt(skip), parseInt(limit));

  if (!postsResponse.success) {
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, postsResponse.message);
  }

  if (postsResponse.data.length === 0) {
    return sendResponse(res, StatusCodes.OK, 'No posts found', []);
  }

  sendResponse(res, StatusCodes.OK, postsResponse.message, postsResponse.data);
});

// Get post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid post ID');
  }

  const postResponse = await postService.getPostById(id);

  sendResponse(
    res,
    postResponse.statusCode,
    postResponse.message,
    postResponse.data || null
  );
});

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Title, content, and author are required');
  }

  const postResponse = await postService.createPost({ title, content, author });

  if (!postResponse.success) {
    return sendResponse(
      res,
      postResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      postResponse.message
    );
  }

  sendResponse(res, StatusCodes.CREATED, postResponse.message, postResponse.data);
});

// Update an existing post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid post ID');
  }

  const postResponse = await postService.getPostById(id);

  if (!postResponse.success) {
    return sendResponse(res, StatusCodes.NOT_FOUND, postResponse.message);
  }

  const updatedFields = {
    title: title || postResponse.data.title,
    content: content || postResponse.data.content,
    author: author || postResponse.data.author,
  };

  const updateResponse = await postService.updatePost(id, updatedFields);

  if (!updateResponse.success) {
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, updateResponse.message);
  }

  sendResponse(res, StatusCodes.OK, updateResponse.message, updateResponse.data);
});

// Partially update a post
const patchPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid post ID');
  }

  const postResponse = await postService.getPostById(id);

  if (!postResponse.success) {
    return sendResponse(res, StatusCodes.NOT_FOUND, postResponse.message);
  }

  const updatedFields = {};
  if (title) updatedFields.title = title;
  if (content) updatedFields.content = content;
  if (author) updatedFields.author = author;

  if (Object.keys(updatedFields).length === 0) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'No fields provided to update');
  }

  const patchResponse = await postService.patchPost(id, updatedFields);

  if (!patchResponse.success) {
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, patchResponse.message);
  }

  sendResponse(res, StatusCodes.OK, patchResponse.message, patchResponse.data);
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid post ID');
  }

  const postResponse = await postService.getPostById(id);

  if (!postResponse.success) {
    return sendResponse(res, StatusCodes.NOT_FOUND, postResponse.message);
  }

  const deleteResponse = await postService.deletePost(id);

  if (!deleteResponse.success) {
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, deleteResponse.message);
  }

  sendResponse(res, StatusCodes.OK, deleteResponse.message);
});

// Upload image for a post
const uploadPostImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid post ID');
  }

  // Check if file was uploaded
  if (!req.file) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'No file uploaded');
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Or store the full URL if using a cloud service

  const postResponse = await postService.addImageToPost(id, imageUrl);

  if (!postResponse.success) {
    return sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, postResponse.message);
  }

  sendResponse(res, StatusCodes.OK, 'Image uploaded successfully', postResponse.data);
});

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  patchPost,
  deletePost,
  uploadPostImage,
};
