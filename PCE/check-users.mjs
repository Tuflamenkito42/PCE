import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkUsers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'pce_user',
        password: process.env.DB_PASSWORD || 'pce_password',
        database: process.env.DB_NAME || 'pce_db',
    });

    const [rows] = await connection.execute('SELECT id, full_name, email, role FROM users');
    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
}

checkUsers().catch(console.error);
