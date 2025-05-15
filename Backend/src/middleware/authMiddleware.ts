import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined for auth middleware.');
  process.exit(1);
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Thi sis According to index.d.ts, this should be the type of user in the request from JWT
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
        // Get token from header
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: string }; 
      req.user = { id: decoded.id };

      next(); // Next middleware
    } catch (error) {
      console.error('Error in the token authentication:', error);
      res.status(401).json({ errors: [{ msg: 'Token is not valid, autorization denied' }] });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ errors: [{ msg: 'There is no a token, autorization denied' }] });
    return;
  }
};