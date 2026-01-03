import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '~/config';
import httpStatus from 'http-status';

const auth = (...requiredRoles: string[]) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          message: 'You are not authorized to access this resource',
        });
      }

      const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
      req.user = decoded;

      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to access this resource',
        });
      }

      next();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'You are unauthorized',
        error: error instanceof Error ? error.message : 'Unauthorized',
      });
    }
  };
};

export default auth;
