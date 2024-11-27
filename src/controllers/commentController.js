const asyncHandler = require('express-async-handler');
const commentService = require('../services/commentService');
const { StatusCodes } = require('http-status-codes');
const { sendResponse } = require('../utils/helper');

// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // The post ID from the URL
  const { author, content, parent } = req.body; // Comment details from request body

  // Ensure required fields are provided
  if (!author || !content) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Author and content are required');
  }

  // Call the comment service to add the comment
  const commentResponse = await commentService.addComment(id, { author, content, parent });

  if (!commentResponse.success) {
    return sendResponse(res, commentResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, commentResponse.message);
  }

  return sendResponse(res, StatusCodes.CREATED, commentResponse.message, commentResponse.data);
});

// Get comments for a post
const getCommentsByPost = asyncHandler(async (req, res) => {
  const { id } = req.params; // The post ID from the URL

  // Call the comment service to fetch comments
  const commentResponse = await commentService.getCommentsByPost(id);

  if (!commentResponse.success) {
    return sendResponse(res, commentResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, commentResponse.message);
  }

  return sendResponse(res, StatusCodes.OK, commentResponse.message, commentResponse.data);
});

// Delete a comment by ID
const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params; // The post ID and comment ID from the URL

  // Call the comment service to delete the comment
  const deleteResponse = await commentService.deleteComment(commentId);

  if (!deleteResponse.success) {
    return sendResponse(res, deleteResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, deleteResponse.message);
  }

  return sendResponse(res, StatusCodes.OK, deleteResponse.message);
});

// Get a comment by ID (including replies)
const getCommentById = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // The comment ID from the URL

  // Call the comment service to fetch the comment by ID
  const commentResponse = await commentService.getCommentById(commentId);

  if (!commentResponse.success) {
    return sendResponse(res, commentResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, commentResponse.message);
  }

  return sendResponse(res, StatusCodes.OK, commentResponse.message, commentResponse.data);
});

// Like a comment
const likeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params; // The comment ID from the URL

  // Call the comment service to like the comment
  const likeResponse = await commentService.likeComment(commentId);

  if (!likeResponse.success) {
    return sendResponse(res, likeResponse.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, likeResponse.message);
  }

  return sendResponse(res, StatusCodes.OK, likeResponse.message, likeResponse.data);
});

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
  getCommentById,
  likeComment,
};
