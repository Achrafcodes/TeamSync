import User from '../../model/users.model.js';
import Task from '../../model/tasks.model.js';

export const AddNewTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, status } = req.body;

    const creator = await User.findById(req.user.id);
    if (!creator) return res.status(404).json({ message: 'Creator not found!' });

    if (!title) {
      return res.status(400).json({ message: 'Missing title!' });
    }

    if (!assignedTo?.email) {
      return res.status(400).json({ message: 'assignedTo is required!' });
    }

    // search for the employee
    const employee = await User.findOne({ email: assignedTo.email });
    if (!employee) {
      return res.status(404).json({ message: 'No employee with this email' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      assignedTo: employee.id,
      createdBy: creator.id,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
