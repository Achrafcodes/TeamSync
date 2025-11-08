// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import mainroute from './src/routes/index.js';
import { logger } from './src/utils/logger.js';

const app = express();

// 1️⃣ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2️⃣ Security headers
app.use(helmet());

// 3️⃣ Manual sanitization (more reliable)
app.use((req, res, next) => {
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    }
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    }
  } catch (error) {
    logger.error('Sanitization error:', error);
  }
  next();
});

// 4️⃣ Request logging
app.use((req, res, next) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 5️⃣ Routes
app.use('/api', mainroute);
// 6️⃣ Error handling
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 7️⃣ Database connection
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
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  logger.error('Unhandled Promise Rejection', { error: err });
  process.exit(1);
});
