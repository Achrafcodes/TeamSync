import jwt from 'jsonwebtoken';
import User from '../model/users.model.js';
export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      message: 'no refresh token was found!',
    });
  }
  const user = await User.findOne({ refreshToken: refreshToken });

  const validToken = jwt.verify(refreshToken, proccess.env.REFRESH_TOKEN);
  if (!validToken) return res.status(401).json({ message: 'invalid jwt refresh Token!' });
  const newToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: '15d',
  });
  User.refreshToken = newToken;
};
