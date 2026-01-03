import { z } from 'zod';

const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['admin', 'customer']).optional(),
});

export const UserValidation = {
    updateUserSchema,
};
