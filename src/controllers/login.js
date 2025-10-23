import User from '../models/signup.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Sc = process.env.SECRET_KEY;
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'user not found check your email and you password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'ivalide password' });
    }

    const token = jwt.sign({ userId: user._id }, Sc, { expiresIn: '1h' });
    console.log(token);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
