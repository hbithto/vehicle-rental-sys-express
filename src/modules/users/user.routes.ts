import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '~/middlewares/validateRequest';
import { UserValidation } from './user.validation';
import auth from '~/middlewares/auth.middleware';

const router = Router();

router.get(
  '/',
  auth('admin'),
  UserController.getAllUsers
);

router.put(
  '/:userId',
  auth('admin', 'customer'),
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUser
);

router.delete(
  '/:userId',
  auth('admin'),
  UserController.deleteUser
);

export const userRoutes = router;
