export const AddNewTask = async (req, res) => {
  const { title, description, priority, assignedTo } = req.body;
  res.json(title);
};
