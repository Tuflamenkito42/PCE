import { useDb } from "../utils/db";
import { requireAdmin } from "../utils/auth-middleware";

export default defineEventHandler(async (event) => {
    // ✅ SECURITY: Only admin can check database connectivity
    requireAdmin(event);
    
    const config = useRuntimeConfig();
    const db = useDb();

    // ✅ SECURITY: Don't expose actual credentials - only safe info
    const dbInfo = {
        connected: false,
        message: 'Testing connection...'
    };

    try {
        const [rows] = await db.query('SELECT 1 as connected');
        return {
            success: true,
            message: 'Conexión exitosa',
            dbInfo
        };
    } catch (e: any) {
        console.error('Test DB Error:', e);
        return {
            success: false,
            message: 'Error de conexión',
            dbInfo,
            error: e.message
        };
    }
});
