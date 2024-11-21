const Category = require("../models/CategoryModel");
const slugify = require('slugify');

// Get all categories with pagination
const getCategoriesWithPagination = async (skip, limit) => {
  try {
    const categories = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort categories by creation date (descending)

    return { success: true, message: 'Categories fetched successfully', data: categories };
  } catch (error) {
    return { success: false, message: 'Error fetching categories', data: null };
  }
};

// Get total number of categories for pagination
const getTotalCategoriesCount = async () => {
  try {
    const count = await Category.countDocuments();
    return { success: true, message: 'Total categories count fetched successfully', data: count };
  } catch (error) {
    return { success: false, message: 'Error fetching categories count', data: null };
  }
};

// Create a new category
const createCategory = async ({ name, description }) => {
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return { success: false, message: 'Category name is required and should be a valid string', data: null };
    }

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
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
    return { success: true, message: 'Category created successfully', data: savedCategory };
  } catch (error) {
    return { success: false, message: 'Error creating category', data: null };
  }
};

// Get category by ID
const getCategoryById = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return { success: false, message: 'Category not found', data: null };
    }
    return { success: true, message: 'Category found', data: category };
  } catch (error) {
    return { success: false, message: 'Error fetching category', data: null };
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
      return { success: false, message: 'Category not found', data: null };
    }

    return { success: true, message: 'Category updated successfully', data: updatedCategory };
  } catch (error) {
    return { success: false, message: 'Error updating category', data: null };
  }
};

// Delete a category
const deleteCategory = async (id) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return { success: false, message: 'Category not found', data: null };
    }

    return { success: true, message: 'Category deleted successfully', data: deletedCategory };
  } catch (error) {
    return { success: false, message: 'Error deleting category', data: null };
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
