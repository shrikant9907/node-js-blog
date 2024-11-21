const Tag = require('../models/tagModel');

exports.getAllTags = async () => {
  return await Tag.find();
};

exports.createTag = async ({ name }) => {
  const newTag = new Tag({ name });
  return await newTag.save();
};

exports.getTagById = async (id) => {
  return await Tag.findById(id);
};

exports.updateTag = async (id, { name }) => {
  const updatedTag = await Tag.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );
  if (!updatedTag) {
    throw new Error('Tag not found');
  }
  return updatedTag;
};

exports.deleteTag = async (id) => {
  const deletedTag = await Tag.findByIdAndDelete(id);
  if (!deletedTag) {
    throw new Error('Tag not found');
  }
  return deletedTag;
};
