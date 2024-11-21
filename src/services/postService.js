const Post = require('../models/postModel');
const slugify = require('slugify');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// Get all posts with pagination
const getAllPosts = async (skip, limit) => {
  try {
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort posts by creation date (descending)

    return { success: true, message: 'Posts fetched successfully', data: posts };
  } catch (error) {
    logger.error('Error fetching posts:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching posts', data: error.message };
  }
};

// Get total number of posts for pagination
const getTotalPostsCount = async () => {
  try {
    const count = await Post.countDocuments();
    return { success: true, message: 'Total posts count fetched successfully', data: count };
  } catch (error) {
    logger.error('Error fetching posts count:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching posts count', data: error.message };
  }
};

// Create a new post
const createPost = async ({ title, content, author }) => {
  try {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      logger.warn('Post title is required and should be a valid string');  // Log a warning if the title is invalid
      return { success: false, message: 'Post title is required and should be a valid string', data: null };
    }

    // Check if a post with the same title already exists
    const existingPost = await Post.findOne({ title: title.trim() });
    if (existingPost) {
      logger.warn(`Post with the title "${title.trim()}" already exists`);  // Log a warning if the post already exists
      return {
        success: false,
        message: 'Post already exists',
        statusCode: 409,  // Conflict error code
        data: null
      };
    }

    let slug = slugify(title, { lower: true, strict: true });

    // Ensure slug is unique
    const existingSlugPost = await Post.findOne({ slug });
    if (existingSlugPost) {
      slug = `${slug}-${Date.now()}`;  // Append timestamp to make it unique
    }

    const newPost = new Post({
      title,
      content,
      author,
      slug,  // Automatically generated or unique slug
    });

    const savedPost = await newPost.save();
    logger.info(`Post created successfully: ${savedPost._id}`);  // Log successful post creation
    return { success: true, message: 'Post created successfully', data: savedPost };
  } catch (error) {
    logger.error('Error creating post:', error);  // Log the error using winston
    return { success: false, message: 'Error creating post', data: error.message };
  }
};

// Get post by ID 
const getPostById = async (id) => {
  try {

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }

    const post = await Post.findById(id);
    if (!post) {
      logger.warn(`Post with ID ${id} not found`);  // Log a warning if the post isn't found
      return {
        success: false,
        message: `Post not found with ID ${id}`,
        statusCode: 404,  // Include 404 Not Found status code
        data: null
      };
    }
    return {
      success: true,
      message: 'Post found',
      statusCode: 200,  // Success status code
      data: post
    };
  } catch (error) {
    logger.error('Error fetching post by ID:', error);  // Log the error using winston
    return {
      success: false,
      message: 'Error fetching post',
      statusCode: 500,  // Internal Server Error status code
      data: error.message
    };
  }
};


// Update an existing post
const updatePost = async (id, { title, content, author }) => {
  try {

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      logger.warn(`Post with ID ${id} not found for update`);  // Log a warning if the post doesn't exist
      return { success: false, message: 'Post not found', data: null };
    }

    logger.info(`Post with ID ${id} updated successfully`);  // Log successful post update
    return { success: true, message: 'Post updated successfully', data: updatedPost };
  } catch (error) {
    logger.error('Error updating post:', error);  // Log the error using winston
    return { success: false, message: 'Error updating post', data: error.message };
  }
};

// Partially update a post
const patchPost = async (id, updateFields) => {
  try {

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      logger.warn(`Post with ID ${id} not found for partial update`);  // Log a warning if the post isn't found
      return { success: false, message: 'Post not found', data: null };
    }

    logger.info(`Post with ID ${id} partially updated successfully`);  // Log successful partial update
    return { success: true, message: 'Post updated successfully', data: updatedPost };
  } catch (error) {
    logger.error('Error updating post (patch):', error);  // Log the error using winston
    return { success: false, message: 'Error updating post', data: error.message };
  }
};

// Delete a post
const deletePost = async (id) => {
  try {

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { statusCode: 404, success: false, message: 'Invalid ID format', data: null };
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      logger.warn(`Post with ID ${id} not found for deletion`);  // Log a warning if the post isn't found
      return { success: false, message: 'Post not found', data: null };
    }

    logger.info(`Post with ID ${id} deleted successfully`);  // Log successful post deletion
    return { success: true, message: 'Post deleted successfully', data: deletedPost };
  } catch (error) {
    logger.error('Error deleting post:', error);  // Log the error using winston
    return { success: false, message: 'Error deleting post', data: error.message };
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
};
