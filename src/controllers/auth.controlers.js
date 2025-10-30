import mongoose from 'mongoose';
import User from '../model/users.model.js';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  if (name.length <= 4) {
    return res.status(400).json({ message: 'name should be atleast 6 chars' });
  }
  if (password.length <= 8) {
    return res.status(400).json({ message: 'Weak password' });
  }
  // 2. Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'Email already in use!' });
  }

  const newUser = new User({ name, email, password });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.status(201).json({ message: `user Created successfully : ${newUser} its token ${token}` });
};
