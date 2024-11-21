const Blog = require('../models/blogModel');

exports.getAllBlogs = async () => {
  return await Blog.find();
};

exports.createBlog = async ({ title, content, author }) => {
  const newBlog = new Blog({ title, content, author });
  return await newBlog.save();
};

exports.getBlogById = async (id) => {
  return await Blog.findById(id);
};

exports.updateBlog = async (id, { title, content, author }) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { title, content, author },
    { new: true, runValidators: true }
  );
  if (!updatedBlog) {
    throw new Error('Blog not found');
  }
  return updatedBlog;
};

exports.patchBlog = async (id, updateFields) => {
  const updatedBlog = await Blog.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
  if (!updatedBlog) {
    throw new Error('Blog not found');
  }
  return updatedBlog;
};

exports.deleteBlog = async (id) => {
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog) {
    throw new Error('Blog not found');
  }
};
