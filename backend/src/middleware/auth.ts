import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No authentication token, access denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin only.' });
    return;
  }
  next();
};
