import http from 'http';
import app from '~/app';
import config from '~/config';
import { logger } from '~/utils/logger';
import { connectToDatabase, disconnectFromDatabase } from '~/db/db.connect';
import { initDB } from '~/db/init';
import { startBookingReturnCron } from '~/cron/booking.cron';

let server: http.Server | null = null;

const isProduction = config.env === 'production';

if (!isProduction) {
    logger.info('Running in dev mode...');
}

const startServer = async (): Promise<void> => {
    try {
        await connectToDatabase();
        await initDB();

        // Start cron jobs
        startBookingReturnCron();

        // Start only after successful db connection
        server = app.listen(config.port, () => {
            const serverInfo = config.env === 'production' ? `https://${config.host}` : `http://${config.host}:${config.port}`;
            logger.info(`server running at: ${serverInfo}`);
        });

    } catch (error) {
        logger.error(`failed to start server: ${error}`);
        process.exit(1);
    }
};

// shutdown handler
const exitHandler = async (): Promise<void> => {
    if (server) {
        server.close(async () => {
            logger.warn('HTTP server closed');
            await disconnectFromDatabase();
            logger.warn('server shutdown complete');
            process.exit(1);
        });
    } else {
        await disconnectFromDatabase();
        process.exit(1);
    }
};

// // Handle unexpected errors
const unexpectedErrorHandler = (error: Error): void => {
    logger.error('unexpected error occurred:', error);
    exitHandler();
};

// // Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error('uncaught exception:', error);
    unexpectedErrorHandler(error);
});

// // Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    logger.error('unhandled rejection at:', promise, 'reason:', reason);
    const error = reason instanceof Error ? reason : new Error(String(reason));
    unexpectedErrorHandler(error);
});

// SIGTERM (termination signal)
process.on('SIGTERM', () => {
    logger.info('SIGTERM received-shutting down server');
    if (server) {
        server.close(async () => {
            await disconnectFromDatabase();
            logger.info('process terminated');
            process.exit(0);
        });
    }
});

// SIGINT (interrupt signal - Ctrl+C)
process.on('SIGINT', () => {
    logger.info('shutting down server');
    exitHandler();
});


startServer();
