import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or bad format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // store decoded payload (id, etc.) in req.user
    next(); // move on to next middleware or route
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
