const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandlerMiddleware = require('./src/middlewares/errorHandlerMiddleware');

// Importing Routes
// const blogRoutes = require('./src/routes/blogRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
// const tagRoutes = require('./src/routes/tagRoutes');
// const pageRoutes = require('./src/routes/pageRoutes');

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
