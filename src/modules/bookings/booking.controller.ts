import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse, sendErrorResponse } from '~/utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        const payload = {
            ...req.body,
            customer_id: user.role === 'customer' ? user.id : (req.body.customer_id || user.id) // admin can specify any customer_id, customer can only book for themselves

        };

        const result = await BookingService.createBooking(payload);

        sendSuccessResponse(res, {
            statusCode: httpStatus.CREATED,
            message: 'Booking created successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        const result = await BookingService.getAllBookings(user.id, user.role);

        sendSuccessResponse(res, {
            statusCode: httpStatus.OK,
            message: user.role === 'customer' ? 'Your bookings retrieved successfully' : 'Bookings retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const user = req.user as any;

        const result = await BookingService.updateBooking(bookingId as string, status, user.id, user.role);

        if (!result) {
            return sendErrorResponse(res, {
                statusCode: httpStatus.NOT_FOUND,
                message: 'Booking not found',
            });
        }

        const message = status === 'returned'
            ? 'Booking marked as returned. Vehicle is now available'
            : 'Booking cancelled successfully';

        sendSuccessResponse(res, {
            statusCode: httpStatus.OK,
            message,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const BookingController = {
    createBooking,
    getAllBookings,
    updateBooking,
};
