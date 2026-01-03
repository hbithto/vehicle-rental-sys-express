import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '~/middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
    '/signup',
    validateRequest(AuthValidation.signupSchema),
    AuthController.registerUser
);

router.post(
    '/signin',
    validateRequest(AuthValidation.signinSchema),
    AuthController.loginUser
);

export const authRoutes = router;
