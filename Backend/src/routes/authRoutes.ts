import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController';
import { handleValidationErrors } from '../middleware/validationErrorHandler';

const router = Router();

const registerValidationRules = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('username')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2 }).withMessage('Username must be at least 2 characters long if provided.'),
];

const loginValidationRules = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

router.post(
  '/register',
  registerValidationRules,
  handleValidationErrors,
  registerUser
);

router.post(
  '/login',
  loginValidationRules,
  handleValidationErrors,
  loginUser
);

export default router;