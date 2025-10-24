import express from 'express';
import { body, validationResult } from 'express-validator';
import { GetUserInfo } from '../controllers/register.js';
import { login } from '../controllers/login.js';
import { LoignValidation, registerValidation, validate } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/signup', registerValidation(), validate, GetUserInfo);
router.post('/login', LoignValidation(), validate, login);
export default router;
