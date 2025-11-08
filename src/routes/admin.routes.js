import { AddNewTask } from '../controllers/tasks/addNewTask.controller.js';
import { verifyPerm } from '../middlewares/verifyPermistion.js';
import { Router } from 'express';
const router = Router();

router.post('/add-task', AddNewTask);

export default router;
