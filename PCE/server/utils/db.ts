import mysql from 'mysql2/promise';

let pool: any;

export const useDb = () => {
    const config = useRuntimeConfig();

    if (!pool) {
        pool = mysql.createPool({
            host: config.dbHost,
            user: config.dbUser,
            password: config.dbPassword,
            database: config.dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    return pool;
};
