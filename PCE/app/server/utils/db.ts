import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export const useDb = () => {
    if (!pool) {
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'pce_user',
            password: process.env.DB_PASSWORD || 'pce_password',
            database: process.env.DB_NAME || 'pce_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };

        try {
            pool = mysql.createPool(dbConfig);
            console.log(`📡 Database pool created for ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database} (using process.env)`);
        } catch (error) {
            console.error('❌ Failed to create database pool:', error);
            throw error;
        }
    }
    return pool;
};
