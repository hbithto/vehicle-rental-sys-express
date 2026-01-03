import { Router } from 'express';
import { VehicleController } from './vehicle.controller';
import validateRequest from '~/middlewares/validateRequest';
import { VehicleValidation } from './vehicle.validation';
import auth from '~/middlewares/auth.middleware';

const router = Router();

router.get('/', VehicleController.getAllVehicles);

router.get('/:vehicleId', VehicleController.getVehicleById);

router.post(
    '/',
    auth('admin'),
    validateRequest(VehicleValidation.createVehicleSchema),
    VehicleController.createVehicle
);

router.put(
    '/:vehicleId',
    auth('admin'),
    validateRequest(VehicleValidation.updateVehicleSchema),
    VehicleController.updateVehicle
);

router.delete(
    '/:vehicleId',
    auth('admin'),
    VehicleController.deleteVehicle
);

export const vehicleRoutes = router;
