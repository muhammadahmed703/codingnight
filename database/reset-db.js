import 'dotenv/config';import mongoose from 'mongoose';
const uri=process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/hcm_lite';
await mongoose.connect(uri);await mongoose.connection.dropDatabase();console.log('Database cleared:',mongoose.connection.name);await mongoose.disconnect();
