import { Router } from 'express';
import { authRoutes } from '~/modules/auth/auth.routes';
import { userRoutes } from '~/modules/users/user.routes';
import { vehicleRoutes } from '~/modules/vehicles/vehicle.routes';
import { bookingRoutes } from '~/modules/bookings/booking.routes';
import { cronRoutes } from '~/cron/cron.routes';
import '~/swagger/routes.registry';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/cron', cronRoutes);

export default router;
