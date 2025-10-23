import express from 'express';

import { GetUserInfo } from '../controllers/register.js';
import { login } from '../controllers/login.js';
const router = express.Router();

router.post('/signup', GetUserInfo);
router.post('/login', login);
export default router;
