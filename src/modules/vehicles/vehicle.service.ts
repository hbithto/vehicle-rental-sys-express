import { getDBClient } from '~/db/db.connect';

const createVehicle = async (payload: Record<string, any>) => {
    const client = getDBClient();
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await client.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) 
         VALUES ($1, $2, $3, $4, COALESCE($5, 'available')) 
         RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result.rows[0];
};

const getAllVehicles = async () => {
    const client = getDBClient();
    const result = await client.query('SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status FROM vehicles');
    return result.rows;
};

const getVehicleById = async (id: string) => {
    const client = getDBClient();
    const result = await client.query(
        `SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
         FROM vehicles WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

const updateVehicle = async (id: string, payload: Record<string, any>) => {
    const client = getDBClient();
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    // dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (vehicle_name) {
        updates.push(`vehicle_name = $${paramIndex++}`);
        values.push(vehicle_name);
    }
    if (type) {
        updates.push(`type = $${paramIndex++}`);
        values.push(type);
    }
    if (registration_number) {
        updates.push(`registration_number = $${paramIndex++}`);
        values.push(registration_number);
    }
    if (daily_rent_price) {
        updates.push(`daily_rent_price = $${paramIndex++}`);
        values.push(daily_rent_price);
    }
    if (availability_status) {
        updates.push(`availability_status = $${paramIndex++}`);
        values.push(availability_status);
    }

    if (updates.length === 0) return null;

    values.push(id);

    const query = `UPDATE vehicles SET ${updates.join(', ')} 
                   WHERE id = $${paramIndex} 
                   RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`;

    const result = await client.query(query, values);
    return result.rows[0];
};

const deleteVehicle = async (id: string) => {
    const client = getDBClient();

    // check for active bookings
    const activeBookings = await client.query(
        `SELECT id FROM bookings 
        WHERE vehicle_id = $1 AND status = 'active'`,
        [id]
    );

    if (activeBookings.rows.length > 0) {
        throw new Error('Vehicle cannot be deleted as it has active bookings');
    }

    const result = await client.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

export const VehicleService = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};
