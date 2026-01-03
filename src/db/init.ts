import { logger } from '~/utils/logger';
import { getDBClient } from './db.connect';

const initDB = async () => {
    try {
        const client = getDBClient();

        // User Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                role VARCHAR(20) CHECK (role IN ('admin', 'customer')) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Vehicle Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                vehicle_name VARCHAR(255) NOT NULL,
                type VARCHAR(20) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
                registration_number VARCHAR(100) UNIQUE NOT NULL,
                daily_rent_price DECIMAL(10, 0) NOT NULL CHECK (daily_rent_price > 0),
                availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available' NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Booking Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
                rent_start_date DATE NOT NULL,
                rent_end_date DATE NOT NULL,
                total_price DECIMAL(10, 0) NOT NULL CHECK (total_price > 0),
                status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active' NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        logger.info('DB initialized successfully');

    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`DB init error: ${error.message}`);
        } else {
            logger.error(`DB init error: ${error}`);
        }
    }
};

export { initDB };
