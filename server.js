import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import router from './src/routes/authroute.js';
import { Router } from 'express';
const app = express();

// ✅ Middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this too
app.use(express.Router());
// ✅ Add a test route to verify server is working
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// ✅ Mount auth routes

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
