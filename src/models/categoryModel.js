const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Category name must be at least 3 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, 'Description cannot exceed 250 characters'],
      default: '',
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
CategorySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // Ensures only alphanumeric characters
    });
  }
  next();
});

// Indexing for faster search on name and slug fields
CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
