import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().min(11, 'Valid phone no. is required'),
    role: z.enum(['admin', 'customer'], { message: 'Role must be either admin or customer' }),
});

const signinSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

export const AuthValidation = {
  signupSchema,
  signinSchema,
};
