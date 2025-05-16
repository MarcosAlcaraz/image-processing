import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const jwtSecretEnv: string | undefined = process.env.JWT_SECRET;
const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '1h';

if (!jwtSecretEnv) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

const JWT_SECRET_KEY: Secret = jwtSecretEnv;

const generateToken = (userId: string): string => {
  const payload = { id: userId };

  const options: SignOptions = {
    expiresIn: jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ errors: [{ msg: 'An user already uses this email' }] });
      return;
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ errors: [{ msg: 'Invalid email' }] });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ errors: [{ msg: 'Invalid password' }] });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    next(error);
  }
};