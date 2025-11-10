import { userPage } from '../controllers/user/user.controlers.js';
import { verifyToken } from '../middlewares/verifiyToken.js';
import { verifyPerm } from '../middlewares/verifyPermistion.js';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import { Router } from 'express';
import userRooute from './user.routes.js';
const router = Router();

// Mount each router under a base path
router.use('/auth', authRoutes);
router.use('/admin', verifyPerm, adminRoutes);
router.use('/user', verifyToken, userRooute);

export default router;
