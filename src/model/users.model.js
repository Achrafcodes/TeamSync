import mongoose from 'mongoose';
const UserModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'adming'],
    default: 'user',
  },
  refreshToken: {
    type: String,
    select: false,
  },
});
