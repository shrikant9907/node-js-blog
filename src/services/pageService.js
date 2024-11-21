const Page = require('../models/pageModel');

/**
 * Get all pages with pagination
 * @param {number} skip - Number of pages to skip for pagination
 * @param {number} limit - Limit for the number of pages to fetch
 * @returns {Object} Success or failure message along with the fetched data
 */
const getPagesWithPagination = async (skip, limit) => {
  try {
    const pages = await Page.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort pages by creation date (descending)

    return { success: true, message: 'Pages fetched successfully', data: pages };
  } catch (error) {
    return { success: false, message: 'Error fetching pages', data: null };
  }
};

/**
 * Get total number of pages for pagination
 * @returns {Object} Success or failure message along with the total page count
 */
const getTotalPagesCount = async () => {
  try {
    const count = await Page.countDocuments();
    return { success: true, message: 'Total pages count fetched successfully', data: count };
  } catch (error) {
    return { success: false, message: 'Error fetching pages count', data: null };
  }
};

/**
 * Create a new page
 * @param {Object} pageData - Data for the new page
 * @returns {Object} Success or failure message along with the created page data
 */
const createPage = async ({ title, content, metaDescription }) => {
  try {
    if (!title || !content) {
      return { success: false, message: 'Title and content are required', data: null };
    }

    // Check if a page with the same title already exists
    const existingPage = await Page.findOne({ title });
    if (existingPage) {
      return { success: false, message: 'Page with this title already exists', data: existingPage };
    }

    const slug = title.toLowerCase().split(' ').join('-');  // Generate slug from title

    const newPage = new Page({
      title,
      content,
      metaDescription,
      slug,
    });

    const savedPage = await newPage.save();
    return { success: true, message: 'Page created successfully', data: savedPage };
  } catch (error) {
    return { success: false, message: 'Error creating page', data: null };
  }
};

/**
 * Get a page by ID
 * @param {string} id - The ID of the page to fetch
 * @returns {Object} Success or failure message along with the page data
 */
const getPageById = async (id) => {
  try {
    const page = await Page.findById(id);

    console.log('page', page)

    if (!page) {
      return { success: false, message: 'Page not found', data: null };
    }
    return { success: true, message: 'Page found', data: page };
  } catch (error) {
    return { success: false, message: 'Error fetching page', data: null };
  }
};

/**
 * Update an existing page
 * @param {string} id - The ID of the page to update
 * @param {Object} updateData - The new data for the page
 * @returns {Object} Success or failure message along with the updated page data
 */
const updatePage = async (id, { title, content, metaDescription }) => {
  try {
    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { title, content, metaDescription },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return { success: false, message: 'Page not found', data: null };
    }

    return { success: true, message: 'Page updated successfully', data: updatedPage };
  } catch (error) {
    return { success: false, message: 'Error updating page', data: null };
  }
};

/**
 * Delete a page
 * @param {string} id - The ID of the page to delete
 * @returns {Object} Success or failure message along with the deleted page data
 */
const deletePage = async (id) => {
  try {
    const deletedPage = await Page.findByIdAndDelete(id);

    if (!deletedPage) {
      return { success: false, message: 'Page not found', data: null };
    }

    return { success: true, message: 'Page deleted successfully', data: deletedPage };
  } catch (error) {
    return { success: false, message: 'Error deleting page', data: null };
  }
};

module.exports = {
  getPagesWithPagination,
  getTotalPagesCount,
  createPage,
  getPageById,
  updatePage,
  deletePage,
};
