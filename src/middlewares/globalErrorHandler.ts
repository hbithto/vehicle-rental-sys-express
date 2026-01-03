import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import httpStatus from 'http-status';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = err.message || 'Something went wrong!';

    if (err instanceof ZodError) {
        statusCode = 400;
        message = err.issues[0]?.message || 'Validation Error';
    } else if (err instanceof Error) {
        message = err.message;

        if (message === "Email is not registered" || message === "Incorrect password") {
            statusCode = httpStatus.NOT_FOUND;
            if (message === "Incorrect password") statusCode = httpStatus.FORBIDDEN;
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default globalErrorHandler;
