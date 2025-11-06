import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controlers.js';
import { verifyToken } from '../middlewares/verifiyToken.js';
import User from '../model/users.model.js';
import { userPage } from '../controllers/user.controlers.js';
import { refresh } from '../controllers/refresh.controlers.js';
import rateLimit from 'express-rate-limit';
import { verifyPerm } from '../utils/verifyPerm.js';
import { admin } from '../controllers/admin.controller.js';

const router = Router();
const limmiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "to many  atteempts please try later"
})

// Public routes
router.post('/login', limmiter, login);
router.post('/register', limmiter, register);
router.post('/refresh', limmiter, refresh);
router.post('/logout', logout)
// Protected route
router.get('/user', verifyToken, userPage);
router.get('/admin', verifyPerm, admin)
export default router;

