import mongoose from 'mongoose';
import User from '../model/users.model.js';
import jwt from 'jsonwebtoken';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate name length (fixed: should be > 5 for "at least 6 chars")
    if (name.length < 6) {
      return res.status(400).json({ message: 'Name should be at least 6 characters' });
    }

    // Validate password length (fixed: should be > 8 for "at least 9 chars")
    if (password.length < 9) {
      return res.status(400).json({ message: 'Password must be at least 9 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use!' });
    }

    // Create and save new user (password will be hashed by pre-save hook)
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 🔥 FIX: Use .select('+password') to include the password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        message: 'No account was found with this email address, please create a new account!',
      });
    }

    // Verify password using the comparePassword method
    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate token
    const accesstoken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '3h' });

    const refreshtoken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: '7d',
    });
    user.refreshToken = refreshtoken;
    await user.save();
    res.status(200).json({
      message: 'Login successful',
      accesstoken,
      refreshtoken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
