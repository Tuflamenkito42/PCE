import { useDb } from "../utils/db";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const db = useDb();

    const dbInfo = {
        host: config.dbHost,
        port: config.dbPort,
        user: config.dbUser,
        database: config.dbName
    };

    try {
        const [rows] = await db.query('SELECT 1 as connected');
        return {
            success: true,
            message: 'Conexión exitosa',
            config: dbInfo,
            rows
        };
    } catch (e: any) {
        console.error('Test DB Error:', e);
        return {
            success: false,
            message: 'Error de conexión',
            config: dbInfo,
            error: e.message,
            code: e.code
        };
    }
});
