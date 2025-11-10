import { Router } from 'express';
import { register, login, logout } from '../controllers/auth/auth.controlers.js';
import { userPage } from '../controllers/user/user.controlers.js';
import { verifyToken } from '../middlewares/verifiyToken.js';
import { refresh } from '../controllers/auth/refresh.controlers.js';
import rateLimit from 'express-rate-limit';
const router = Router();
const limmiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'to many  atteempts please try later',
});

// Public routes
router.post('/login', limmiter, login);
router.post('/register', limmiter, register);
router.post('/refresh', limmiter, refresh);
router.post('/logout', logout);
// Protected route
router.get('/user', verifyToken, userPage);
export default router;
