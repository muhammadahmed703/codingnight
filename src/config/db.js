import mongoose from 'mongoose';

let connectionPromise;
export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hcm_lite';
    connectionPromise = mongoose.connect(uri).then(() => mongoose.connection).catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
}
