import { z } from 'zod';

const createVehicleSchema = z.object({
  vehicle_name: z.string().min(1, 'Vehicle name is required'),
  type: z.enum(['car', 'bike', 'van', 'SUV'], { message: 'Vehicle type must be either car, bike, van or SUV' }),
  registration_number: z.string().min(1, 'Registration number is required'),
  daily_rent_price: z.string().min(1, 'Daily rent price is required').transform(val => parseInt(val, 10)),
  availability_status: z.enum(['available', 'booked'], { message: `Availability status must be either 'available' or 'booked'` }),
});

const updateVehicleSchema = z.object({
  vehicle_name: z.string().optional(),
  type: z.enum(['car', 'bike', 'van', 'SUV']).optional(),
  registration_number: z.string().optional(),
  daily_rent_price: z.string().transform(val => parseInt(val, 10)).optional(),
  availability_status: z.enum(['available', 'booked']).optional(),
});

export const VehicleValidation = {
  createVehicleSchema,
  updateVehicleSchema,
};
