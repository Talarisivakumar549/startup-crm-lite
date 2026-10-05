import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Establishes a connection to the MongoDB Atlas database.
 * Logs success message with connection host on connection.
 * Exits application with code 1 if connection fails.
 * 
 * @returns {Promise<void>} Resolves when connection is successful.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
