import express from 'express';

import { GetUserInfo } from '../controllers/login.js';

const router = express.Router();

router.post('/signup', GetUserInfo);
export default router;
