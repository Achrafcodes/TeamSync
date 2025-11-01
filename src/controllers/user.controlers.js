import users from '../model/users.model.js';

export const userPage = async (req, res) => {
  try {
    const user = await users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'USER NOT CONNECTED!' });
    }
    res.status(200).json({
      message: `welcome ${user.name}`,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
