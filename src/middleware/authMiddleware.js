import { body, validationResult } from 'express-validator';

export const registerValidation = () => [
  body('username')
    .notEmpty()
    .withMessage('Name is requiered!')
    .isLength({ min: 3 })
    .withMessage('Name must be atleat 3 characters!'),
  body('email').isEmail().withMessage('Email is Requierd').normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is Requierd!')
    .escape()
    .isLength({ min: 6 })
    .withMessage('password should be atleast 6 characters'),
];
export const LoignValidation = () => [
  body('email').isEmail().withMessage('Email is required').normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('passsword is required!')
    .isLength({ min: 6 })
    .withMessage('password should be at least 6 characters'),
];

export const validate = (req, res, next) => {
  const error = validationResult(req);
  if (error) {
    return res.status(400).json({ error: error.array() });
  }
  next();
};
