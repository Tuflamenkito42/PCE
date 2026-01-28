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

        await db.query(`
            CREATE TABLE IF NOT EXISTS affiliations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                dni VARCHAR(20) NOT NULL,
                birthdate DATE,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                quota DECIMAL(10, 2) NOT NULL,
                message TEXT,
                payment_intent_id VARCHAR(255),
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS donations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                amount DECIMAL(10, 2) NOT NULL,
                message TEXT,
                payment_intent_id VARCHAR(255),
                status VARCHAR(50) DEFAULT 'pending',
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
