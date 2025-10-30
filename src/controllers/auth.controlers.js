import mongoose from 'mongoose';
import User from '../model/users.model.js';

export const register = async (req, res) => {
  const { name, email, password } = await req.body;
  const user = User.findOne({ email: email });
  if (user) {
  }
};
