import dotenv from 'dotenv';
dotenv.config(); // ← MUST BE FIRST

import mongoose from 'mongoose';
import express from 'express';
import connection from './src/db/connection.js';
import cors from 'cors';
import Authrouter from './src/routes/authRoutes.js';

const Port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ← Fixed
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Routes
app.use('/api', Authrouter);

// Start server
connection().then(() => {
  app.listen(Port, () => {
    console.log(`Server Started at port ${Port}`);
  });
});
