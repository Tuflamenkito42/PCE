import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function createNewUser() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'pce_user',
        password: process.env.DB_PASSWORD || 'pce_password',
        database: process.env.DB_NAME || 'pce_db',
    });

    const email = 'adolfoH@gmail.com';
    const password = '12345678Aa';
    const fullName = 'adolfo H';
    const dni = '00000000T';
    const role = 'public';

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Delete if exists to avoid conflicts
        await connection.execute('DELETE FROM users WHERE email = ?', [email]);

        await connection.execute(
            'INSERT INTO users (email, password, full_name, dni, role) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, fullName, dni, role]
        );
        console.log(`Usuario ${email} creado correctamente con contraseña: ${password}`);
    } catch (error) {
        console.error('Error al crear usuario:', error);
    } finally {
        await connection.end();
    }
}

createNewUser().catch(console.error);
