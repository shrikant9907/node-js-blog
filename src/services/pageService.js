const Page = require('../models/pageModel');
const logger = require('../utils/logger');  // Import the logger

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

    logger.info('Pages fetched successfully');
    return { success: true, message: 'Pages fetched successfully', data: pages };
  } catch (error) {
    logger.error('Error fetching pages:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching pages', data: error.message };
  }
};

/**
 * Get total number of pages for pagination
 * @returns {Object} Success or failure message along with the total page count
 */
const getTotalPagesCount = async () => {
  try {
    const count = await Page.countDocuments();
    logger.info('Total pages count fetched successfully');
    return { success: true, message: 'Total pages count fetched successfully', data: count };
  } catch (error) {
    logger.error('Error fetching pages count:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching pages count', data: error.message };
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
      logger.warn('Title and content are required');  // Log a warning if title or content is missing
      return { success: false, message: 'Title and content are required', data: null };
    }

    // Check if a page with the same title already exists
    const existingPage = await Page.findOne({ title });
    if (existingPage) {
      logger.warn(`Page with this title already exists: ${title}`);  // Log a warning if the page exists
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
    logger.info(`Page created successfully with ID: ${savedPage._id}`);  // Log successful page creation
    return { success: true, message: 'Page created successfully', data: savedPage };
  } catch (error) {
    logger.error('Error creating page:', error);  // Log the error using winston
    return { success: false, message: 'Error creating page', data: error.message };
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

    if (!page) {
      logger.warn(`Page with ID ${id} not found`);  // Log a warning if the page is not found
      return { success: false, message: 'Page not found', data: null };
    }
    logger.info(`Page with ID ${id} found`);
    return { success: true, message: 'Page found', data: page };
  } catch (error) {
    logger.error('Error fetching page by ID:', error);  // Log the error using winston
    return { success: false, message: 'Error fetching page', data: error.message };
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
      logger.warn(`Page with ID ${id} not found for update`);  // Log a warning if the page is not found
      return { success: false, message: 'Page not found', data: null };
    }

    logger.info(`Page with ID ${id} updated successfully`);  // Log successful update
    return { success: true, message: 'Page updated successfully', data: updatedPage };
  } catch (error) {
    logger.error('Error updating page:', error);  // Log the error using winston
    return { success: false, message: 'Error updating page', data: error.message };
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
      logger.warn(`Page with ID ${id} not found for deletion`);  // Log a warning if the page is not found
      return { success: false, message: 'Page not found', data: null };
    }

    logger.info(`Page with ID ${id} deleted successfully`);  // Log successful deletion
    return { success: true, message: 'Page deleted successfully', data: deletedPage };
  } catch (error) {
    logger.error('Error deleting page:', error);  // Log the error using winston
    return { success: false, message: 'Error deleting page', data: error.message };
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
