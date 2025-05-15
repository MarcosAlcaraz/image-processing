import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController';
// Opcional: Middleware para manejar los errores de validación de forma centralizada
// import { handleValidationErrors } from '../middleware/validationMiddleware';

const router = Router();

// Reglas de validación para el registro
const registerValidationRules = [
  body('email')
    .isEmail().withMessage('Por favor, introduce un correo electrónico válido.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('El nombre de usuario debe tener al menos 2 caracteres.'),
];

// Reglas de validación para el login
const loginValidationRules = [
  body('email')
    .isEmail().withMessage('Por favor, introduce un correo electrónico válido.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
];

// POST /api/auth/register
router.post(
  '/register',
  registerValidationRules,
  // (Opcional) handleValidationErrors, // Si creas un middleware para esto
  registerUser
);

// POST /api/auth/login
router.post(
  '/login',
  loginValidationRules,
  // (Opcional) handleValidationErrors,
  loginUser
);

export default router;