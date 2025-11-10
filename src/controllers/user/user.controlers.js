import users from '../../model/users.model.js';
import Tasks from '../../model/tasks.model.js';

export const userPage = async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) return res.status(400).json({ message: 'Please Login !' });
    const userTasks = await Tasks.find({ assignedTo: user });
    if (!userTasks)
      return res.status(404).json({ message: 'no task for you today enjoy your day' });
    res.status(200).json({ tasks: { user, userTasks } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
