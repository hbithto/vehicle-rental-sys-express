import { Router } from 'express';
import { CronController } from '~/cron/cron.controller';

const router = Router();

router.get('/booking-return', CronController.bookingReturnCronController);

export const cronRoutes = router;
