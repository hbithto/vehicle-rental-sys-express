import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string[];
};

const sendSuccessResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    ...(data.data && { data: data.data }),
  });
};

const sendErrorResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: false,
    message: data.message,
    ...(data.errors && { errors: data.errors }),
  });
};

export {
    sendSuccessResponse,
    sendErrorResponse,
};
