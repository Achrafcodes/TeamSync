import jwt from 'jsonwebtoken';
import User from '../model/users.model.js';
export const verifyPerm = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or bad format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // store decoded payload (id, etc.) in req.user
    const user = await User.findOne({ _id: req.user.id });
    if (user.role !== 'admin') return res.status(403).json('access denied');

    next(); // move on to next middleware or route
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
