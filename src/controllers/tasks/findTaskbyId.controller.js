import Tasks from '../../model/tasks.model.js';

export const GetTaskFromId = async (req, res) => {
  try {
    const TaskId = req.params.id;
    if (!TaskId) return res.status(400).json({ message: 'no Task was Provided' });
    const Task = await Tasks.findById(TaskId);
    if (!Task) return res.status(404).json({ message: 'no Task was found with this id ' });
    res.json({ message: Task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
