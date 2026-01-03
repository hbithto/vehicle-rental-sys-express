import { getDBClient } from '~/db/db.connect';

const createBooking = async (payload: Record<string, any>) => {
    const client = getDBClient();
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // check user exists
    const customerResult = await client.query('SELECT * FROM users WHERE id = $1', [customer_id]);
    if (customerResult.rows.length === 0) {
        throw new Error('User not found');
    }

    // Check vehicle availability
    const vehicleResult = await client.query('SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1', [vehicle_id]);

    if (vehicleResult.rows.length === 0) {
        throw new Error('Vehicle not found');
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') {
        throw new Error('Vehicle is not available');
    }

    // total price calculation
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const total_price = diffDays * Number(vehicle.daily_rent_price);

    try {
        await client.query('BEGIN');

        // create booking
        const bookingResult = await client.query(
            `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
             VALUES ($1, $2, $3, $4, $5, 'active') 
             RETURNING 
             id, 
             customer_id, 
             vehicle_id, 
             rent_start_date,
             rent_end_date,
             total_price::INT AS total_price, 
             status`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);

        // update vehicle status
        await client.query(
            `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
            [vehicle_id]
        );

        await client.query('COMMIT');

        const booking = bookingResult.rows[0];

        const vehicleDetails = await client.query(`
            SELECT 
            vehicle_name, 
            daily_rent_price::INT AS daily_rent_price 
            FROM vehicles WHERE id = $1`,
            [vehicle_id]);

        return {
            ...booking,
            vehicle: vehicleDetails.rows[0]
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
};

const getAllBookings = async (userId: string, role: string) => {
    const client = getDBClient();
    let query = `
    SELECT 
      b.id, 
      ${role === 'admin' ? 'b.customer_id, ' : ''}
      b.vehicle_id, 
      b.rent_start_date, 
      b.rent_end_date, 
      b.total_price::INT AS total_price,
      b.status,
      ${role === 'admin'
            ? `json_build_object(
               'name', u.name,
               'email', u.email
               ) as customer,`
            : ''
        }
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number
        ${role === 'customer' ? `,'type', v.type` : ''}
      ) as vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id
  `;

    const params: any[] = [];

    if (role === 'customer') {
        query += ` WHERE b.customer_id = $1`;
        params.push(userId);
    }

    const result = await client.query(query, params);
    return result.rows;
};

const updateBooking = async (bookingId: string, status: string, userId: string, role: string) => {
    const client = getDBClient();

    const bookingResult = await client.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);

    if (bookingResult.rows.length === 0) {
        return null;
    }

    const booking = bookingResult.rows[0];

    if (role === 'customer') {
        if (booking.customer_id != userId) {
            throw new Error('You are not authorized to update this booking');
        }
        if (status === 'cancelled') {
            if (new Date(booking.rent_start_date) < new Date()) {
                throw new Error('Cannot cancel booking after start date');
            }
        } else {
            throw new Error('You can only cancel bookings');
        }
    }

    if (role === 'admin') {
        if (status !== 'returned') {
            throw new Error('Invalid status');
        }
    }

    try {
        await client.query('BEGIN');

        // update booking
        const updatedBooking = await client.query(
            `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING 
            id, 
            customer_id, 
            vehicle_id, 
            rent_start_date, 
            rent_end_date, 
            total_price::INT AS total_price, 
            status`,
            [status, bookingId]
        );

        if (status === 'cancelled' || status === 'returned') {
            // update vehicle status
            await client.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }

        await client.query('COMMIT');

        const vehicleDetails = (role === 'admin'
            ? await client.query(`
            SELECT 
            availability_status 
            FROM vehicles WHERE id = $1`, [booking.vehicle_id])
            : null);

        return {
            ...updatedBooking.rows[0],
            ...(role === 'admin'
                ? { vehicle: vehicleDetails!.rows[0] }
                : {}),
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
};

export const BookingService = {
    createBooking,
    getAllBookings,
    updateBooking,
};
