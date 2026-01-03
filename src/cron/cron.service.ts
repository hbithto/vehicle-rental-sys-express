import { getDBClient } from '~/db/db.connect';
import { logger } from '~/utils/logger';


export const bookingReturnCron = async () => {
    const client = getDBClient();

    try {
        await client.query('BEGIN');

        const overdueBookingsResult = await client.query(
            `SELECT id, vehicle_id 
                 FROM bookings 
                 WHERE status = 'active' 
                 AND rent_end_date < CURRENT_DATE`
        );

        const overdueBookings = overdueBookingsResult.rows;

        if (overdueBookings.length === 0) {
            logger.info('[CRON] No overdue bookings found');
            await client.query('ROLLBACK');
            return;
        }

        logger.info(`[CRON] Found ${overdueBookings.length} overdue booking(s) to return`);

        const bookingIds = overdueBookings.map((b: any) => b.id);
        const vehicleIds = overdueBookings.map((b: any) => b.vehicle_id);

        // update bookings
        await client.query(
            `UPDATE bookings 
                 SET status = 'returned', updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ANY($1::int[])`,
            [bookingIds]
        );

        // release vehicles
        await client.query(
            `UPDATE vehicles 
                 SET availability_status = 'available', updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ANY($1::int[])`,
            [vehicleIds]
        );

        await client.query('COMMIT');

        logger.info(`[CRON] Successfully returned ${overdueBookings.length} booking(s) and released vehicles`);

    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to return bookings');
    }
};
