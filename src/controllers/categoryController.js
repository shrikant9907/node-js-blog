const asyncHandler = require('express-async-handler');
const categoryService = require('../services/categoryService');

// Get all categories with pagination
const getAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query; // Default to page 1, limit 20
  const skip = (page - 1) * limit;

  // Call service to get categories with pagination
  const result = await categoryService.getCategoriesWithPagination(skip, limit);

  if (!result.success) {
    return res.status(500).json({ message: result.message });
  }

  // Call service to get total categories count
  const totalCategoriesResult = await categoryService.getTotalCategoriesCount();

  if (!totalCategoriesResult.success) {
    return res.status(500).json({ message: totalCategoriesResult.message });
  }

  // Return paginated categories with total count
  res.status(200).json({
    message: 'Categories retrieved successfully',
    categories: result.data,
    totalCategories: totalCategoriesResult.data,
    currentPage: page,
    totalPages: Math.ceil(totalCategoriesResult.data / limit),
  });
});

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Validate category name
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  // Call service to create a new category
  const result = await categoryService.createCategory({ name, description });

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  // Return success response with newly created category
  res.status(201).json({
    message: 'Category created successfully',
    newCategory: result.data,
  });
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get category by ID
  const result = await categoryService.getCategoryById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Return success response with category data
  res.status(200).json({
    message: 'Category retrieved successfully',
    category: result.data,
  });
});

// Update an existing category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // Call service to get category by ID
  const result = await categoryService.getCategoryById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  const updatedFields = {
    name: name || result.data.name,
    description: description || result.data.description,
  };

  // Call service to update category
  const updateResult = await categoryService.updateCategory(id, updatedFields);

  if (!updateResult.success) {
    return res.status(500).json({ message: updateResult.message });
  }

  // Return success response with updated category
  res.status(200).json({
    message: 'Category updated successfully',
    updatedCategory: updateResult.data,
  });
});

// Partially update a category
const patchCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // Call service to get category by ID
  const result = await categoryService.getCategoryById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  const updatedFields = {};

  if (name) updatedFields.name = name;
  if (description) updatedFields.description = description;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ message: 'No fields provided to update' });
  }

  // Call service to update category
  const updateResult = await categoryService.updateCategory(id, updatedFields);

  if (!updateResult.success) {
    return res.status(500).json({ message: updateResult.message });
  }

  // Return success response with partially updated category
  res.status(200).json({
    message: 'Category partially updated successfully',
    updatedCategory: updateResult.data,
  });
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Call service to get category by ID
  const result = await categoryService.getCategoryById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  // Call service to delete category
  const deleteResult = await categoryService.deleteCategory(id);

  if (!deleteResult.success) {
    return res.status(500).json({ message: deleteResult.message });
  }

  // Return success response after deletion
  res.status(200).json({ message: 'Category deleted successfully' });
});

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  patchCategory,
  deleteCategory,
};
