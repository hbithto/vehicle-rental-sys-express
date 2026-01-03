import { z } from 'zod';

const createBookingSchema = z.object({
    customer_id: z.string().min(1, 'Customer ID is required').transform(val => parseInt(val, 10)),
    vehicle_id: z.string().min(1, 'Vehicle ID is required').transform(val => parseInt(val, 10)),
    rent_start_date: z.string().min(1, 'Start date is required')
        .refine((date) => new Date(date) > new Date(), { message: 'Start date must be in the future' }),
    rent_end_date: z.string().min(1, 'End date is required')
        .refine((date) => new Date(date) > new Date(), { message: 'End date must be in the future' }),
}).refine((data) => new Date(data.rent_end_date) >= new Date(data.rent_start_date), {
    message: 'End date must be on or after start date',
    path: ['rent_end_date'],
});

const updateBookingSchema = z.object({
    status: z.enum(['cancelled', 'returned'], { message: 'Status must be either cancelled or returned' }),
});

export const BookingValidation = {
    createBookingSchema,
    updateBookingSchema,
};
