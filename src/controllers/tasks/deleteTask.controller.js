import Tasks from '../../model/tasks.model.js';

export const DeleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ message: 'no id was given!' });
    const Deletetask = await Tasks.findByIdAndDelete(taskId);
    res.status(200).json({
      messgae: 'task was deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
