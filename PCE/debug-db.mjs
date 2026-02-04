import mysql from 'mysql2/promise';

async function test(host, user, password) {
    console.log(`Testing ${user}@${host}:3306...`);
    try {
        const connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            port: 3306,
            database: 'pce_db'
        });
        console.log(`✅ Success for ${user}@${host}`);
        await connection.end();
    } catch (e) {
        console.log(`❌ Failed for ${user}@${host}: ${e.message}`);
    }
}

async function run() {
    await test('localhost', 'root', 'root');
    await test('127.0.0.1', 'root', 'root');
    await test('localhost', 'pce_user', 'pce_password');
    await test('127.0.0.1', 'pce_user', 'pce_password');
}

run();
