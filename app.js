const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todoRoutes');
const errorHandlerMiddleware = require('./src/middlewares/errorHandlerMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:80']
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
