const Tag = require("../models/tagModel");
const slugify = require('slugify');

// Get all tags with pagination
const getTagsWithPagination = async (skip, limit) => {
  try {
    const tags = await Tag.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort tags by creation date (descending)

    return { success: true, message: 'Tags fetched successfully', data: tags };
  } catch (error) {
    return { success: false, message: 'Error fetching tags', data: null };
  }
};

// Get total number of tags for pagination
const getTotalTagsCount = async () => {
  try {
    const count = await Tag.countDocuments();
    return { success: true, message: 'Total tags count fetched successfully', data: count };
  } catch (error) {
    return { success: false, message: 'Error fetching tags count', data: null };
  }
};

// Create a new tag
const createTag = async ({ name }) => {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return { success: false, message: 'Tag name is required and should be a valid string', data: null };
    }

    // Check if a tag with the same name already exists
    const existingTag = await Tag.findOne({ name: name.trim() });
    if (existingTag) {
      return { success: false, message: `Tag already exists with the name ${name.trim()}`, data: null };
    }

    let slug = slugify(name, { lower: true, strict: true });

    // Ensure slug is unique
    const existingSlugTag = await Tag.findOne({ slug });
    if (existingSlugTag) {
      slug = `${slug}-${Date.now()}`;  // Append timestamp to make it unique
    }

    const newTag = new Tag({
      name,
      slug,  // Automatically generated or unique slug
    });

    const savedTag = await newTag.save();
    return { success: true, message: 'Tag created successfully', data: savedTag };
  } catch (error) {
    return { success: false, message: 'Error creating tag', data: null };
  }
};

// Get tag by ID
const getTagById = async (id) => {
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return { success: false, message: 'Tag not found', data: null };
    }
    return { success: true, message: 'Tag found', data: tag };
  } catch (error) {
    return { success: false, message: 'Error fetching tag', data: null };
  }
};

// Update an existing tag
const updateTag = async (id, { name }) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return { success: false, message: 'Tag not found', data: null };
    }

    return { success: true, message: 'Tag updated successfully', data: updatedTag };
  } catch (error) {
    return { success: false, message: 'Error updating tag', data: null };
  }
};

// Delete a tag
const deleteTag = async (id) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return { success: false, message: 'Tag not found', data: null };
    }

    return { success: true, message: 'Tag deleted successfully', data: deletedTag };
  } catch (error) {
    return { success: false, message: 'Error deleting tag', data: null };
  }
};

module.exports = {
  getTagsWithPagination,
  getTotalTagsCount,
  createTag,
  getTagById,
  updateTag,
  deleteTag,
};
