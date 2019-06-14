import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../models/User';

type payload = { _id: number };

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization');
    if (!header) {
      throw new Error();
    }
    const token = header.replace('Bearer ', '');
    const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await getRepository(User).findOneOrFail({
      edgarId: (decoded as payload)._id,
    });

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const permit = (...allowed: [string]) => {
  const isAllowed = (role: string) => allowed.indexOf(role) > -1;

  // return a middleware
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && isAllowed(req.user.role)) {
      // role is allowed, so continue on the next middleware
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' }); // user is forbidden
    }
  };
};
