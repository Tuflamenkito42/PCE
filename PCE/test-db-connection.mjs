import mysql from 'mysql2/promise';

console.log('🧪 Iniciando diagnóstico de base de datos...');

const configurations = [
    { name: 'XAMPP Default (Localhost)', user: 'root', password: '', port: 3306 },
    { name: 'XAMPP Default (IP)', user: 'root', password: '', port: 3306, host: '127.0.0.1' },
    { name: 'MAMP/Custom (Localhost)', user: 'root', password: 'root', port: 3306 },
    { name: 'MAMP/Custom (IP)', user: 'root', password: 'root', port: 3306, host: '127.0.0.1' },
    { name: 'MAMP Alternate', user: 'root', password: 'root', port: 8889 },
    { name: 'MySQL Alternate', user: 'root', password: '', port: 3307 },
    { name: 'Common: admin', user: 'root', password: 'admin', port: 3306 },
    { name: 'Common: mysql', user: 'root', password: 'mysql', port: 3306 },
    { name: 'Common: 1234', user: 'root', password: '1234', port: 3306 },
    { name: 'Common: password', user: 'root', password: 'password', port: 3306 },
    { name: 'Common: pce', user: 'root', password: 'pce', port: 3306 },
];

async function testConnection(config) {
    console.log(`\n⏳ Probando: ${config.name} (User: ${config.user}, Pass: ${config.password ? '****' : '<empty>'}, Port: ${config.port})...`);
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: config.user,
            password: config.password,
            port: config.port,
            database: 'pce_db'
        });
        console.log(`✅ ¡ÉXITO! Conexión establecida con configuración: ${config.name}`);
        await connection.end();
        return config;
    } catch (error) {
        console.log(`❌ Fallo: ${error.message}`);
        return null;
    }
}

(async () => {
    for (const config of configurations) {
        const success = await testConnection(config);
        if (success) {
            console.log('\n✨ DIAGNÓSTICO COMPLETADO ✨');
            console.log('Configuración válida encontrada:');
            console.log(`DB_USER=${success.user}`);
            console.log(`DB_PASSWORD=${success.password}`);
            console.log(`DB_PORT=${success.port}`);
            return;
        }
    }
    console.log('\n⚠️ DIAGNÓSTICO FINALIZADO: Ninguna configuración estándar funcionó.');
    console.log('Por favor verifica si el servicio MySQL está corriendo.');
})();
