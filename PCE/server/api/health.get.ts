export default defineEventHandler(async (event) => {
    try {
        const db = useDb();
        const [rows] = await db.query('SELECT 1 as val');
        return {
            status: 'ok',
            db: 'connected',
            val: (rows as any)[0].val
        };
    } catch (err: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database connection error: ' + err.message
        });
    }
});
