import { Router } from 'express';
import { register, login } from '../controllers/auth.controlers.js';
import { verifyToken } from '../middlewares/verifiyToken.js';
import User from '../model/users.model.js';
import { userPage } from '../controllers/user.controlers.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected route
router.get('/user', verifyToken, userPage);
export default router;
