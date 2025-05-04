import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@shared/config/config';
import { UserRepositoryImpl } from '@modules/user/repositories/user.repository.impl';

const userRepository = new UserRepositoryImpl();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => { // Usa los tipos
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autenticación requerida' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verify(token, JWT_SECRET) as { email: string; role: string };
    const user = await userRepository.getUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.user = { email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};