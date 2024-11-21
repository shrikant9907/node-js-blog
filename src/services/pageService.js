const Page = require('../models/pageModel');

/**
 * Service to get all pages from the database
 * @returns {Promise} A promise that resolves to an array of pages
 */
exports.getAllPages = async () => {
  try {
    return await Page.find();
  } catch (error) {
    throw new Error('Error fetching pages: ' + error.message);
  }
};

/**
 * Service to create a new page
 * @param {Object} pageData - The data to create a page
 * @returns {Promise} A promise that resolves to the newly created page
 */
exports.createPage = async (pageData) => {
  try {
    const existingPage = await Page.findOne({ title: pageData.title });
    if (existingPage) {
      throw new Error('Page with this title already exists');
    }

    const newPage = new Page({
      title: pageData.title,
      content: pageData.content,
      metaDescription: pageData.metaDescription,
      slug: pageData.title.toLowerCase().split(' ').join('-'), // Generate slug from title
    });

    return await newPage.save();
  } catch (error) {
    throw new Error('Error creating page: ' + error.message);
  }
};

/**
 * Service to get a page by its ID
 * @param {string} id - The ID of the page
 * @returns {Promise} A promise that resolves to the page object or null if not found
 */
exports.getPageById = async (id) => {
  try {
    const page = await Page.findById(id);
    if (!page) {
      throw new Error('Page not found');
    }
    return page;
  } catch (error) {
    throw new Error('Error fetching page: ' + error.message);
  }
};

/**
 * Service to update a page by its ID
 * @param {string} id - The ID of the page to be updated
 * @param {Object} updateData - The updated data
 * @returns {Promise} A promise that resolves to the updated page
 */
exports.updatePage = async (id, updateData) => {
  try {
    const page = await Page.findById(id);
    if (!page) {
      throw new Error('Page not found');
    }

    const updatedPage = await Page.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedPage;
  } catch (error) {
    throw new Error('Error updating page: ' + error.message);
  }
};

/**
 * Service to delete a page by its ID
 * @param {string} id - The ID of the page to be deleted
 * @returns {Promise} A promise that resolves to the deleted page object or null if not found
 */
exports.deletePage = async (id) => {
  try {
    const page = await Page.findById(id);
    if (!page) {
      throw new Error('Page not found');
    }

    const deletedPage = await Page.findByIdAndDelete(id);
    return deletedPage;
  } catch (error) {
    throw new Error('Error deleting page: ' + error.message);
  }
};
