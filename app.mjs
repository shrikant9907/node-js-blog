import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.mjs'; // Adjusted for ES Module import
import errorHandlerMiddleware from './src/middlewares/errorHandlerMiddleware.js'; // Adjusted for ES Module import

// Importing Routes
import categoryRoutes from './src/routes/categoryRoutes.js'; // Adjusted for ES Module import
// import blogRoutes from './src/routes/blogRoutes.js';
// import tagRoutes from './src/routes/tagRoutes.js';
// import pageRoutes from './src/routes/pageRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:80']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandlerMiddleware); // Error handling middleware

// Routes
// app.use('/api/posts', blogRoutes);
app.use('/api/categories', categoryRoutes);
// app.use('/api/tags', tagRoutes);
// app.use('/api/pages', pageRoutes);

// Connect with DB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export app as default for testing or other imports
export default app;
