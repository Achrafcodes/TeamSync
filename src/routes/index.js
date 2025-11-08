import { verifyPerm } from '../middlewares/verifyPermistion.js';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import { Router } from 'express';
const router = Router();

// Mount each router under a base path
router.use('/auth', authRoutes);
router.use('/admin', verifyPerm, adminRoutes);

export default router;
