const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const { StatusCodes } = require('http-status-codes');

// Add a comment to a post (and handle nested replies)
const addComment = async (postId, { author, content, parent = null }) => {
  try {
    // Ensure the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Post not found' };
    }

    // Create the new comment
    const newComment = new Comment({
      post: postId,
      author,
      content,
      parent,  // if this is a reply, parent will be the parent comment ID
    });

    const savedComment = await newComment.save();

    // If it's a reply, update the parent comment's `replies` array
    if (parent) {
      const parentComment = await Comment.findById(parent);
      if (parentComment) {
        parentComment.replies.push(savedComment._id);
        await parentComment.save();
      } else {
        return { success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Parent comment not found' };
      }
    }

    // Push the comment to the post's comments array
    post.comments.push(savedComment._id);
    await post.save();

    return { success: true, message: 'Comment added successfully', data: savedComment };
  } catch (error) {
    return { success: false, message: 'Error adding comment', data: error.message };
  }
};

// Get comments for a post, including nested replies
const getCommentsByPost = async (postId) => {
  try {
    // Retrieve the post and populate the comments, including nested replies
    const post = await Post.findById(postId).populate({
      path: 'comments',
      populate: { path: 'replies' },
    });

    if (!post) {
      return { success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Post not found' };
    }

    return { success: true, message: 'Comments retrieved successfully', data: post.comments };
  } catch (error) {
    return { success: false, message: 'Error retrieving comments', data: error.message };
  }
};

// Delete a comment by ID
const deleteComment = async (commentId) => {
  try {
    // Find and delete the comment
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return { success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Comment not found' };
    }

    // If the comment has a parent, remove this comment from the parent's replies
    if (comment.parent) {
      const parentComment = await Comment.findById(comment.parent);
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(reply => reply.toString() !== commentId);
        await parentComment.save();
      }
    }

    // Optionally, remove the comment reference from the related post's comments array
    const post = await Post.findById(comment.post);
    if (post) {
      post.comments = post.comments.filter(comment => comment.toString() !== commentId);
      await post.save();
    }

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    return { success: false, message: 'Error deleting comment', data: error.message };
  }
};

// Get a comment by ID (with nested replies populated)
const getCommentById = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId).populate('replies');
    if (!comment) {
      return { success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Comment not found' };
    }
    return { success: true, message: 'Comment found', data: comment };
  } catch (error) {
    return { success: false, message: 'Error finding comment', data: error.message };
  }
};

// Like a comment (increment the like count)
const likeComment = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return { success: false, statusCode: StatusCodes.NOT_FOUND, message: 'Comment not found' };
    }

    comment.likes += 1;
    await comment.save();

    return { success: true, message: 'Comment liked', data: comment };
  } catch (error) {
    return { success: false, message: 'Error liking comment', data: error.message };
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
  getCommentById,
  likeComment,
};
