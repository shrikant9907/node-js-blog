const mongoose = require('mongoose');

// Helper function to validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper function for common response
const sendResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        message,
        data,
    });
};

module.exports = {
    validateObjectId,
    sendResponse
}