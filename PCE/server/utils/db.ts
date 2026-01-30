import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export const useDb = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'pce_user',
            password: process.env.DB_PASSWORD || 'pce_password',
            database: process.env.DB_NAME || 'pce_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
};
