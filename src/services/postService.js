const Post = require('../models/postModel');
const slugify = require('slugify');
const logger = require('../utils/logger');
const { validateObjectId } = require('../utils/helper');

/**
 * Fetch all posts with pagination
 * @param {number} skip - Number of posts to skip for pagination
 * @param {number} limit - Number of posts to fetch
 * @returns {Object} Result containing success status, message, and data
 */
const getAllPosts = async (skip, limit) => {
  try {
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    logger.info('Posts fetched successfully');
    return { success: true, message: 'Posts fetched successfully', data: posts };
  } catch (error) {
    logger.error('Error fetching posts:', error);
    return { success: false, message: 'Error fetching posts', data: error.message };
  }
};

/**
 * Get total count of posts
 * @returns {Object} Result containing success status, message, and total count
 */
const getTotalPostsCount = async () => {
  try {
    const count = await Post.countDocuments();
    logger.info('Total posts count fetched successfully');
    return { success: true, message: 'Total posts count fetched successfully', data: count };
  } catch (error) {
    logger.error('Error fetching total posts count:', error);
    return { success: false, message: 'Error fetching posts count', data: error.message };
  }
};

/**
 * Create a new post
 * @param {Object} postData - Data for the new post
 * @returns {Object} Result containing success status, message, and created post data
 */
const createPost = async ({ title, content, author }) => {
  try {
    if (!title || !content || !author) {
      logger.warn('Missing required fields: title, content, or author');
      return { success: false, message: 'Title, content, and author are required', data: null };
    }

    const existingPost = await Post.findOne({ title });
    if (existingPost) {
      logger.warn(`Post with title "${title}" already exists`);
      return { success: false, message: 'Post with this title already exists', statusCode: 409 };
    }

    let slug = slugify(title, { lower: true, strict: true });
    const existingSlug = await Post.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    const newPost = await Post.create({ title, content, author, slug });
    logger.info(`Post created successfully with ID: ${newPost._id}`);
    return { success: true, message: 'Post created successfully', data: newPost };
  } catch (error) {
    logger.error('Error creating post:', error);
    return { success: false, message: 'Error creating post', data: error.message };
  }
};

/**
 * Get a single post by ID
 * @param {string} id - Post ID
 * @returns {Object} Result containing success status, message, and post data
 */
const getPostById = async (id) => {
  try {
    if (!validateObjectId(id)) {
      logger.warn(`Invalid ID format: ${id}`);
      return { success: false, message: 'Invalid ID format', statusCode: 404 };
    }

    const post = await Post.findById(id);
    if (!post) {
      logger.warn(`Post with ID ${id} not found`);
      return { success: false, message: 'Post not found', statusCode: 404 };
    }

    logger.info(`Post with ID ${id} fetched successfully`);
    return { success: true, message: 'Post fetched successfully', data: post };
  } catch (error) {
    logger.error('Error fetching post by ID:', error);
    return { success: false, message: 'Error fetching post', data: error.message };
  }
};

/**
 * Update a post by ID
 * @param {string} id - Post ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Result containing success status, message, and updated post data
 */
const updatePost = async (id, updateData) => {
  try {
    if (!validateObjectId(id)) {
      logger.warn(`Invalid ID format: ${id}`);
      return { success: false, message: 'Invalid ID format', statusCode: 404 };
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedPost) {
      logger.warn(`Post with ID ${id} not found`);
      return { success: false, message: 'Post not found', statusCode: 404 };
    }

    logger.info(`Post with ID ${id} updated successfully`);
    return { success: true, message: 'Post updated successfully', data: updatedPost };
  } catch (error) {
    logger.error('Error updating post:', error);
    return { success: false, message: 'Error updating post', data: error.message };
  }
};

/**
 * Partially update a post by ID
 * @param {string} id - Post ID
 * @param {Object} updateFields - Fields to update
 * @returns {Object} Result containing success status, message, and updated post data
 */
const patchPost = async (id, updateFields) => {
  try {
    if (!validateObjectId(id)) {
      logger.warn(`Invalid ID format: ${id}`);
      return { success: false, message: 'Invalid ID format', statusCode: 404 };
    }

    const updatedPost = await Post.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    if (!updatedPost) {
      logger.warn(`Post with ID ${id} not found`);
      return { success: false, message: 'Post not found', statusCode: 404 };
    }

    logger.info(`Post with ID ${id} partially updated successfully`);
    return { success: true, message: 'Post updated successfully', data: updatedPost };
  } catch (error) {
    logger.error('Error patching post:', error);
    return { success: false, message: 'Error updating post', data: error.message };
  }
};

/**
 * Delete a post by ID
 * @param {string} id - Post ID
 * @returns {Object} Result containing success status and message
 */
const deletePost = async (id) => {
  try {
    if (!validateObjectId(id)) {
      logger.warn(`Invalid ID format: ${id}`);
      return { success: false, message: 'Invalid ID format', statusCode: 404 };
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      logger.warn(`Post with ID ${id} not found`);
      return { success: false, message: 'Post not found', statusCode: 404 };
    }

    logger.info(`Post with ID ${id} deleted successfully`);
    return { success: true, message: 'Post deleted successfully', data: deletedPost };
  } catch (error) {
    logger.error('Error deleting post:', error);
    return { success: false, message: 'Error deleting post', data: error.message };
  }
};

// Add image URL to post
const addImageToPost = async (postId, imageUrl) => {
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return { success: false, message: 'Post not found' };
    }

    post.image = imageUrl;  // Store the image URL in the `image` field
    await post.save();

    return { success: true, message: 'Image uploaded successfully', data: post };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getAllPosts,
  getTotalPostsCount,
  createPost,
  getPostById,
  updatePost,
  patchPost,
  deletePost,
  addImageToPost,
};
