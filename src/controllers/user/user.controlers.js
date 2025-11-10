import users from '../../model/users.model.js';

export const userPage = async (req, res) => {
  try {
    console.log(req);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
