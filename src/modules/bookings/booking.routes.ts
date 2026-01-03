import { Router } from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '~/middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import auth from '~/middlewares/auth.middleware';

const router = Router();

router.get(
    '/',
    auth('admin', 'customer'),
    BookingController.getAllBookings
);

router.post(
    '/',
    auth('admin', 'customer'),
    validateRequest(BookingValidation.createBookingSchema),
    BookingController.createBooking
);

router.put(
    '/:bookingId',
    auth('admin', 'customer'),
    validateRequest(BookingValidation.updateBookingSchema),
    BookingController.updateBooking
);

export const bookingRoutes = router;
