import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1); 
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('We Have a Successfully Connection to MongoDB.');

    mongoose.connection.on('error', (err) => {
      console.error(`Error in MongoDB connection: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected.');
    });

  } catch (error) {
    console.error('Error when we tryed to connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;