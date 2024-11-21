const Post = require('../models/postModel');
const slugify = require('slugify');

// Get all posts with pagination
const getAllPosts = async (skip, limit) => {
  try {
    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort posts by creation date (descending)

    return { success: true, message: 'Posts fetched successfully', data: posts };
  } catch (error) {
    return { success: false, message: 'Error fetching posts', data: null };
  }
};

// Get total number of posts for pagination
const getTotalPostsCount = async () => {
  try {
    const count = await Post.countDocuments();
    return { success: true, message: 'Total posts count fetched successfully', data: count };
  } catch (error) {
    return { success: false, message: 'Error fetching posts count', data: null };
  }
};

// Create a new post
const createPost = async ({ title, content, author }) => {
  try {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return { success: false, message: 'Post title is required and should be a valid string', data: null };
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
    return { success: true, message: 'Post created successfully', data: savedPost };
  } catch (error) {
    console.log('error', error)
    return { success: false, message: 'Error creating post', data: null };
  }
};

// Get post by ID
const getPostById = async (id) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      return { success: false, message: 'Post not found', data: null };
    }
    return { success: true, message: 'Post found', data: post };
  } catch (error) {
    return { success: false, message: 'Error fetching post', data: null };
  }
};

// Update an existing post
const updatePost = async (id, { title, content, author }) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return { success: false, message: 'Post not found', data: null };
    }

    return { success: true, message: 'Post updated successfully', data: updatedPost };
  } catch (error) {
    return { success: false, message: 'Error updating post', data: null };
  }
};

// Partially update a post
const patchPost = async (id, updateFields) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return { success: false, message: 'Post not found', data: null };
    }

    return { success: true, message: 'Post updated successfully', data: updatedPost };
  } catch (error) {
    return { success: false, message: 'Error updating post', data: null };
  }
};

// Delete a post
const deletePost = async (id) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return { success: false, message: 'Post not found', data: null };
    }

    return { success: true, message: 'Post deleted successfully', data: deletedPost };
  } catch (error) {
    return { success: false, message: 'Error deleting post', data: null };
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
