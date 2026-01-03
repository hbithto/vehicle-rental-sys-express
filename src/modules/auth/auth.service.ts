import jwt from 'jsonwebtoken';
import config from '~/config';
import bcrypt from 'bcryptjs';
import { getDBClient } from '~/db/db.connect';

export const signup = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    try {
        const hashedPassword = await bcrypt.hash(password as string, 10);
        const client = getDBClient();

        // Check if email exists
        const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            throw new Error('Email already exists');
        }

        const user = await client.query(
            `INSERT INTO users (name, email, password, phone, role) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, name, email, phone, role`,
            [name, email, hashedPassword, phone, role]
        );
        return user.rows[0];
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to signup');
    }
};

export const signin = async (payload: Record<string, unknown>) => {
    const { email, password } = payload;
    try {
        const client = getDBClient();
        const user = await client.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);

        if (user.rows.length === 0) {
            throw new Error('Email is not registered');
        }

        const isPassValid = await bcrypt.compare(password as string, user.rows[0].password);
        if (!isPassValid) {
            throw new Error('Incorrect password');
        }

        const userData = user.rows[0];

        const token = jwt.sign(
            {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
            },
            config.jwtSecret as string,
            { expiresIn: '1d', algorithm: 'HS256' }
        );

        return {
            token,
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
            },
        };

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to signin');
    }
};
