import { getDBClient } from '~/db/db.connect';

const getAllUsers = async () => {
    const client = getDBClient();
    const result = await client.query(`SELECT id, name, email, phone, role FROM users`);
    return result.rows;
};

const updateUser = async (id: string, payload: Record<string, any>) => {
    const client = getDBClient();
    const {
        name,
        email,
        phone,
        role
    } = payload;

    // check if user email is already in use
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (existingUser.rows.length > 0) {
        throw new Error('Email already in use, use a different email');
    }

    // dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
    }
    if (email) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email);
    }
    if (phone) {
        updates.push(`phone = $${paramIndex++}`);
        values.push(phone);
    }
    if (role) {
        updates.push(`role = $${paramIndex++}`);
        values.push(role);
    }

    if (updates.length === 0) return null; // no updates to make

    values.push(id);

    const query = `UPDATE users SET ${updates.join(', ')} 
                   WHERE id = $${paramIndex} 
                   RETURNING id, name, email, phone, role`;

    const result = await client.query(query, values);

    return result.rows[0];
};

const deleteUser = async (id: string) => {
    const client = getDBClient();

    // check for active bookings
    const activeBookings = await client.query(
        `SELECT id FROM bookings 
         WHERE customer_id = $1 AND status = 'active'`,
        [id]
    );

    if (activeBookings.rows.length > 0) {
        throw new Error('User cannot be deleted as they have active bookings');
    }

    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

export const UserService = {
    getAllUsers,
    updateUser,
    deleteUser,
};
