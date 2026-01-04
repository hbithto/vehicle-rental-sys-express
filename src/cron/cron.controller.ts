import { Request, Response } from 'express';
import { bookingReturnCron } from '~/cron/cron.service';
import { sendErrorResponse, sendSuccessResponse } from '~/utils/sendResponse';
import httpStatus from 'http-status';
import config from '~/config';

const bookingReturnCronController = async (req: Request, res: Response) => {
    try {
        const cronSecret = req.headers.authorization;
        if (!cronSecret || cronSecret !== `Bearer ${config.cronSecret}`) {
            return sendErrorResponse(res, {
                statusCode: httpStatus.UNAUTHORIZED,
                message: 'Unauthorized'
            });
        }

        await bookingReturnCron();
        sendSuccessResponse(res, {
            statusCode: httpStatus.OK,
            message: 'Bookings returned successfully'
        });
    } catch (error: any) {
        sendErrorResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message || 'Failed to return bookings'
        });
    }
};

export const CronController = {
    bookingReturnCronController,
};
