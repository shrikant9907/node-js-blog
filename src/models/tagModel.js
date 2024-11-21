const mongoose = require('mongoose');
const slugify = require('slugify');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Tag name must be at least 3 characters'],
      maxlength: [50, 'Tag name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
  }
);

// Middleware to automatically generate `slug` before saving the document
TagSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // Ensures only alphanumeric characters
    });
  }
  next();
});

// Indexing for faster search on name and slug fields
TagSchema.index({ name: 1 });
TagSchema.index({ slug: 1 });

const Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag;
