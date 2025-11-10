import { Router } from 'express';
import { GetTaskFromId } from '../controllers/tasks/findTaskbyId.controller.js';
import { AddNewTask } from '../controllers/tasks/addNewTask.controller.js';
import { getTasks } from '../controllers/tasks/getTasks.controller.js';
const router = Router();

router.post('/add-task', AddNewTask);
router.get('/get-task', getTasks);
router.get('/get-task/:id', GetTaskFromId);
export default router;
