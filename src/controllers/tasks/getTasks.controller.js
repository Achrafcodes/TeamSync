import Tasks from '../../model/tasks.model.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find();
    if (!tasks) return res.status(404).json({ message: 'No availble tasks for the momment' });
    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
