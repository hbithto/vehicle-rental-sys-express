import { Client } from "pg";
import { logger } from "~/utils/logger";
import config from "~/config";


let client: Client | null = null;
let db: any = null;
let connectionRetries = 0;
const maxRetries = 3;
const retryDelay = 5000; // 5 seconds

const createClient = () => {
  return new Client({
    connectionString: config.db_conn_string,
    connectionTimeoutMillis: 10000, // 10 seconds
  });
};

const setupEventHandlers = (client: Client) => {
  client.on('error', async (err: Error) => {
    logger.error(`DB connection error: ${err.message}`);
    await handleConnectionError();
  });

  client.on('end', () => {
    logger.warn('DB connection ended');
  });

  client.on('notification', (message: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    logger.info(`Database notification: ${message}`);
  });
};

const handleConnectionError = async () => {
  if (connectionRetries < maxRetries) {
    connectionRetries++;
    logger.warn(`Retrying db connection... (${connectionRetries}/${maxRetries})`);
    
    setTimeout(async () => {
      try {
        await connectToDatabase();
      } catch (error) {
        logger.error(`Retry ${connectionRetries} failed: ${error}`);
      }
    }, retryDelay * connectionRetries); // Exponential backoff
  } else {
    logger.error('Max db connection retries reached. Exiting...');
    process.exit(1);
  }
};

const connectToDatabase = async (): Promise<void> => {
  try {
    if (client) { // Close existing connection (if any)
      await client.end();
    }

    client = createClient();
    setupEventHandlers(client);
    
    await client.connect();
    await client.query('SELECT NOW()'); // Test the connection
    logger.info('DB connection established');
    connectionRetries = 0; // Reset retry counter on successful connection
    
  } catch (error) {
    logger.error(`Failed to connect to db: ${error}`);
    throw error;
  }
};

const disconnectFromDatabase = async (): Promise<void> => {
  try {
    if (client) {
      await client.end();
      client = null;
      db = null;
      logger.info('Disconnected from db');
    }
  } catch (error) {
    logger.error(`Error disconnecting from db: ${error}`);
  }
};

const getDBClient = () => {
  if (!client) { throw new Error('DB client not initialized.'); }
  return client;
};

export { 
  connectToDatabase, 
  disconnectFromDatabase, 
  getDBClient,
};
