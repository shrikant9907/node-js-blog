const pageService = require('../services/pageService');

/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Retrieve all pages
 *     responses:
 *       200:
 *         description: List of all pages
 */
exports.getAllPages = async (req, res) => {
  try {
    const pages = await pageService.getAllPages();
    res.status(200).json({
      success: true,
      message: 'Pages fetched successfully',
      data: pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pages: ' + error.message,
      data: null,
    });
  }
};

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Page created successfully
 */
exports.createPage = async (req, res) => {
  try {
    const pageData = req.body;
    const newPage = await pageService.createPage(pageData);
    res.status(201).json({
      success: true,
      message: 'Page created successfully',
      data: newPage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating page: ' + error.message,
      data: null,
    });
  }
};

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Retrieve a page by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the page
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single page
 *       404:
 *         description: Page not found
 */
exports.getPageById = async (req, res) => {
  try {
    const page = await pageService.getPageById(req.params.id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Page fetched successfully',
      data: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching page: ' + error.message,
      data: null,
    });
  }
};

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     summary: Update a page by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the page
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               metaDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       404:
 *         description: Page not found
 */
exports.updatePage = async (req, res) => {
  try {
    const updatedPage = await pageService.updatePage(req.params.id, req.body);
    if (!updatedPage) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Page updated successfully',
      data: updatedPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating page: ' + error.message,
      data: null,
    });
  }
};

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     summary: Delete a page by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the page
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page deleted successfully
 *       404:
 *         description: Page not found
 */
exports.deletePage = async (req, res) => {
  try {
    const deletedPage = await pageService.deletePage(req.params.id);
    if (!deletedPage) {
      return res.status(404).json({
        success: false,
        message: 'Page not found',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Page deleted successfully',
      data: deletedPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting page: ' + error.message,
      data: null,
    });
  }
};
