const Page = require('../models/pageModel');

exports.getAllPages = async () => {
  return await Page.find();
};

exports.createPage = async ({ title, content, slug, metaDescription }) => {
  const newPage = new Page({ title, content, slug, metaDescription });
  return await newPage.save();
};

exports.getPageById = async (id) => {
  return await Page.findById(id);
};

exports.updatePage = async (id, { title, content, slug, metaDescription }) => {
  const updatedPage = await Page.findByIdAndUpdate(
    id,
    { title, content, slug, metaDescription },
    { new: true, runValidators: true }
  );
  if (!updatedPage) {
    throw new Error('Page not found');
  }
  return updatedPage;
};

exports.deletePage = async (id) => {
  const deletedPage = await Page.findByIdAndDelete(id);
  if (!deletedPage) {
    throw new Error('Page not found');
  }
  return deletedPage;
};
