const Category = require("../models/CategoryModel");
const slugify = require('slugify');
const logger = require('../utils/logger');  // Import the logger

// Get all categories with pagination
const getCategoriesWithPagination = async (skip, limit) => {
  try {
    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort categories by creation date (descending)

    logger.info('Categories fetched successfully');
    return { success: true, message: 'Categories fetched successfully', data: categories };
  } catch (error) {
    logger.error('Error fetching categories:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching categories', data: error.message };
  }
};

// Get total number of categories for pagination
const getTotalCategoriesCount = async () => {
  try {
    const count = await Category.countDocuments();
    logger.info('Total categories count fetched successfully');
    return { success: true, message: 'Total categories count fetched successfully', data: count };
  } catch (error) {
    logger.error('Error fetching categories count:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching categories count', data: error.message };
  }
};

// Create a new category
const createCategory = async ({ name, description }) => {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      logger.warn('Category name is required and should be a valid string');  // Log a warning if name is invalid
      return { success: false, message: 'Category name is required and should be a valid string', data: null };
    }

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      logger.warn(`Category already exists with the name ${name.trim()}`);  // Log a warning if category exists
      return { success: false, message: `Category already exists with the name ${name.trim()}`, data: null };
    }

    let slug = slugify(name, { lower: true, strict: true });

    // Ensure slug is unique
    const existingSlugCategory = await Category.findOne({ slug });
    if (existingSlugCategory) {
      slug = `${slug}-${Date.now()}`;  // Append timestamp to make it unique
    }

    const newCategory = new Category({
      name,
      description,
      slug,  // Automatically generated or unique slug
    });

    const savedCategory = await newCategory.save();
    logger.info(`Category created successfully with ID: ${savedCategory._id}`);  // Log successful category creation
    return { success: true, message: 'Category created successfully', data: savedCategory };
  } catch (error) {
    logger.error('Error creating category:', error);  // Log the error using winston
    return { success: false, message: 'Error creating category', data: error.message };
  }
};

// Get category by ID
const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id);

    if (!category) {
      logger.warn(`Category with ID ${id} not found`);  // Log a warning if the category is not found
      return { success: false, message: 'Category not found', data: null };
    }
    logger.info(`Category with ID ${id} found`);
    return { success: true, message: 'Category found', data: category };
  } catch (error) {
    logger.error('Error fetching category by ID:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching category', data: error.message };
  }
};

// Update an existing category
const updateCategory = async (id, { name, description }) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      logger.warn(`Category with ID ${id} not found for update`);  // Log a warning if the category is not found
      return { success: false, message: 'Category not found', data: null };
    }

    logger.info(`Category with ID ${id} updated successfully`);  // Log successful update
    return { success: true, message: 'Category updated successfully', data: updatedCategory };
  } catch (error) {
    logger.error('Error updating category:', error);  // Log the error using winston
    return { success: false, message: 'Error updating category', data: error.message };
  }
};

// Delete a category
const deleteCategory = async (id) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      logger.warn(`Category with ID ${id} not found for deletion`);  // Log a warning if the category is not found
      return { success: false, message: 'Category not found', data: null };
    }

    logger.info(`Category with ID ${id} deleted successfully`);  // Log successful deletion
    return { success: true, message: 'Category deleted successfully', data: deletedCategory };
  } catch (error) {
    logger.error('Error deleting category:', error);  // Log the error using winston
    return { success: false, message: 'Error deleting category', data: error.message };
  }
};

module.exports = {
  getCategoriesWithPagination,
  getTotalCategoriesCount,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
