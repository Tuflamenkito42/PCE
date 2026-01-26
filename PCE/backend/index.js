import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Ajustar a producció
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'pce_user',
    password: process.env.DB_PASSWORD || 'pce_password',
    database: process.env.DB_NAME || 'pce_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB Connection
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 as val');
        res.json({ status: 'ok', db: 'connected', val: rows[0].val });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Socket.io (Xat en temps real)
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('chat_message', (msg) => {
        io.emit('chat_message', msg); // Broadcast simple
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
