import { Router } from 'express';
import { GetTaskFromId } from '../controllers/tasks/findTaskbyId.controller.js';
import { AddNewTask } from '../controllers/tasks/addNewTask.controller.js';
import { getTasks } from '../controllers/tasks/getTasks.controller.js';
import { UpdateTask } from '../controllers/tasks/updateTask.controller.js';
import { DeleteTask } from '../controllers/tasks/deleteTask.controler.js';
const router = Router();

router.post('/add-task', AddNewTask);
router.get('/get-task', getTasks);
router.get('/get-task/:id', GetTaskFromId);
router.put('/update-task/:id', UpdateTask);
router.delete('/delete-task/:id', DeleteTask);
export default router;
