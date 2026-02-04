import { createPool, type Pool } from 'mysql2/promise';

let pool: Pool;

export const useDb = () => {
    if (!pool) {
        const config = useRuntimeConfig();
        const dbConfig = {
            host: config.dbHost || 'localhost',
            port: Number(config.dbPort) || 3306,
            user: config.dbUser || 'pce_user',
            password: config.dbPassword || 'pce_password',
            database: config.dbName || 'pce_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };

        try {
            pool = createPool(dbConfig);
            console.log(`📡 Database pool created for ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database} (using process.env)`);
        } catch (error) {
            console.error('❌ Failed to create database pool:', error);
            throw error;
        }
    }
    return pool;
};
