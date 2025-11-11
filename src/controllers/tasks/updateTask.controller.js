import Task from '../../model/tasks.model.js';

export const UpdateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, priority, assignedTo } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'No task ID provided' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'No task found with this ID' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        priority,
        assignedTo,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
