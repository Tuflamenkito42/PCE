export default defineEventHandler(async (event) => {
    const db = useDb();

    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                dni VARCHAR(20),
                role VARCHAR(50) DEFAULT 'public',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        return { status: 'ok', message: 'Database tables initialized' };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Database initialization failed: ' + error.message
        });
    }
});
