CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) DEFAULT 'Anónimo',
    email VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    message TEXT,
    payment_intent_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
