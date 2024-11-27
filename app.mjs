import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.mjs'; // Adjusted for ES Module import
import errorHandlerMiddleware from './src/middlewares/errorHandlerMiddleware.js'; // Adjusted for ES Module import
import swaggerJSDoc from 'swagger-jsdoc'; // Import swagger-jsdoc
import swaggerUi from 'swagger-ui-express'; // Import swagger-ui-express

// Importing Routes
import categoryRoutes from './src/routes/categoryRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import tagRoutes from './src/routes/tagRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 5000;

// Serve the uploads directory
// app.use('/uploads', express.static('uploads'));

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: "*",
  // origin: ['http://localhost:3000', 'http://localhost:80']
};

// Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',  // OpenAPI version
    info: {
      title: 'My API',  // API title
      version: '1.0.0',  // API version
      description: 'API documentation generated automatically for my Express app',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,  // Your API server URL
      },
    ],
  },
  apis: ['./src/routes/*.js'],  // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandlerMiddleware); // Error handling middleware

// Serve Swagger UI at '/api-docs'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/comments', commentRoutes);

// Connect with DB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export app as default for testing or other imports
export default app;
