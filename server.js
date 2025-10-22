import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import connection from './src/db/connection.js';
import cors from 'cors';
dotenv.config();

const Port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded);
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
connection().then(() => {
  app.listen(Port, () => {
    console.log(`Server Started at port ${Port}`);
  });
});
