const mongoose = require('mongoose');
const slugify = require('slugify');

const MediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },
    filepath: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    mimetype: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
  }
);

// Middleware to automatically generate `slug` before saving the document
MediaSchema.pre('save', function (next) {
  if (!this.slug && this.filename) {
    this.slug = slugify(this.filename, {
      lower: true,
      strict: true, // Ensures only alphanumeric characters
    });
  }
  next();
});

// Indexing for faster search on filename and slug fields
MediaSchema.index({ filename: 1 });
MediaSchema.index({ slug: 1 });

const Media = mongoose.model('Media', MediaSchema);
module.exports = Media;
