import User from '../models/signup.model.js';
import jwt from 'jsonwebtoken';
const SecretKey = process.env.SECRET_KEY;
const port = process.env.PORT;
export const GetUserInfo = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body, 'portis', port);
  console.log(SecretKey);
  try {
    let user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      return res.status(400).json({ message: 'erorr email already in use!' });
    }
    user = new User({ username, email, password });
    await user.save();
    console.log('User saved successfully');

    const token = jwt.sign({ userId: user._id }, SecretKey, { expiresIn: '1h' });

    console.log(token);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
