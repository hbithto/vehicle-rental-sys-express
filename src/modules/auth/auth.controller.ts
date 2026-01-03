import { Request, Response, NextFunction } from 'express';
import { signin, signup } from './auth.service';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '~/utils/sendResponse';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await signup(req.body);

        sendSuccessResponse(res, {
            statusCode: httpStatus.CREATED,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await signin(req.body);
        sendSuccessResponse(res, {
            statusCode: httpStatus.OK,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const AuthController = {
    registerUser,
    loginUser,
};
