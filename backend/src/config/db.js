/**
 * MongoDB Connection Configuration
 * Uses mongoose with automatic retry logic on connection failure.
 */
import mongoose from 'mongoose';

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 5;

/**
 * Connect to MongoDB with exponential back-off retry.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Mongoose 7+ no longer requires useNewUrlParser / useUnifiedTopology
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries += 1;
      console.error(
        `❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (retries >= MAX_RETRIES) {
        console.error('❌ Max MongoDB connection retries reached.');
        throw error;
      }

      // Exponential back-off
      const delay = RETRY_DELAY_MS * retries;
      console.log(`⏳ Retrying in ${delay / 1000}s…`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Graceful shutdown helpers
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

export default connectDB;
