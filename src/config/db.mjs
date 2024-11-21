import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Import dotenv to load environment variables from .env file

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB at ${conn.connection.host}`);
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB; // Export the connectDB function
