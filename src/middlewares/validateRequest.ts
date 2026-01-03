import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const validateRequest = <T extends z.ZodType>(schema: T) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error.issues[0]?.message || 'Validation failed',
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
