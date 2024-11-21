const mongoose = require('mongoose');
const slugify = require('slugify');

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Page content is required'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      maxlength: [250, 'Meta description cannot exceed 250 characters'],
      default: '',
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` automatically
  }
);

// Middleware to automatically generate `slug` before saving the document
PageSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true, // Ensures only alphanumeric characters
    });
  }
  next();
});

// Indexing for faster search on title and slug fields
PageSchema.index({ title: 1 });
PageSchema.index({ slug: 1 });

const Page = mongoose.model('Page', PageSchema);
module.exports = Page;
