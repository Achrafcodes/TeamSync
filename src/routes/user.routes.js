import { Router } from 'express';
import { verifyToken } from '../middlewares/verifiyToken.js';
import { userPage } from '../controllers/user/user.controlers.js';
const router = Router();

router.get('/user', verifyToken, userPage);

export default router;
