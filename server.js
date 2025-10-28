import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import router from './src/routes/authroute.js';

const app = express();

// ✅ Middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this too

// ✅ Add a test route to verify server is working
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ✅ Mount auth routes
app.use('/api/auth', router); // Changed from '/' to '/api/auth'

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server listening on port ${process.env.PORT}`);
      console.log(`✅ MongoDB connected`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
