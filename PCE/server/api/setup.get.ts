import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    // ✅ SECURITY: PROTECT SETUP ENDPOINT - Only allow during development/deployment
    // This endpoint MUST be disabled in production to prevent database reset
    const config = useRuntimeConfig();
    const allowSetup = config.allowSetup === 'true' || config.allowSetup === true;
    
    if (!allowSetup) {
        console.warn('⛔ [SECURITY] Setup endpoint blocked - allowSetup is disabled');
        throw createError({
            statusCode: 403,
            message: 'Setup endpoint is disabled. This endpoint can only run during initial setup.'
        });
    }

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
                card_photo_path VARCHAR(255),
                card_photo_mime VARCHAR(120),
                payment_intent_id VARCHAR(255),
                status VARCHAR(50) DEFAULT 'pending',
                photo_url VARCHAR(255),
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

        await db.query(`
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                active BOOLEAN DEFAULT TRUE
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poll_title VARCHAR(255) NOT NULL,
                option_selected VARCHAR(255) NOT NULL,
                user_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS job_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                offer_id VARCHAR(120) NOT NULL,
                full_name VARCHAR(160) NOT NULL,
                email VARCHAR(160) NOT NULL,
                phone VARCHAR(80) NOT NULL,
                city VARCHAR(120) NOT NULL,
                availability VARCHAR(255) NOT NULL,
                motivation TEXT NOT NULL,
                cv_file_path VARCHAR(255) NULL,
                cv_original_name VARCHAR(255) NULL,
                cv_mime_type VARCHAR(120) NULL,
                status VARCHAR(40) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_job_status (status),
                INDEX idx_job_created_at (created_at)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS carnet_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NULL,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NULL,
                address VARCHAR(255) NULL,
                city VARCHAR(120) NULL,
                postal_code VARCHAR(10) NULL,
                country VARCHAR(120) NULL,
                nif VARCHAR(20) NULL,
                numero_socio VARCHAR(50) NULL,
                amount DECIMAL(10, 2) DEFAULT 5.00,
                payment_intent_id VARCHAR(255) NULL,
                status VARCHAR(50) DEFAULT 'completed',
                shipping_status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_carnet_email (email),
                INDEX idx_carnet_status (status),
                INDEX idx_carnet_shipping_status (shipping_status),
                INDEX idx_carnet_created_at (created_at)
            )
        `);

        // Initialize admin user
        const adminEmail = 'admin@pce-web.com';
        const adminPass = 'admin123';
        const hashedAdminPass = await bcrypt.hash(adminPass, 10);

        const [adminRows] = await db.query('SELECT id FROM users WHERE email = ?', [adminEmail]);

        if ((adminRows as any[]).length === 0) {
            await db.query(
                `INSERT INTO users (email, password, full_name, dni, role)
                 VALUES (?, ?, ?, ?, ?)`,
                [adminEmail, hashedAdminPass, 'Administrador Sistema', '00000000A', 'admin']
            );
            console.log('Admin user created');
        } else {
            // Update password for existing admin to ensure it matches 'admin123'
            await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedAdminPass, adminEmail]);
            console.log('Admin password updated');
        }

        return { status: 'ok', message: 'Database tables initialized and admin user checked' };
    } catch (error: any) {
        const errorDetail = error.message || error.code || 'Error desconocido';
        console.error('Setup error:', errorDetail);
        throw createError({
            statusCode: 500,
            message: 'Database initialization failed: ' + errorDetail
        });
    }
});
