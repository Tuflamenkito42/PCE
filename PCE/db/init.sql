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
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_affiliations_email (email),
    INDEX idx_affiliations_dni (dni),
    INDEX idx_affiliations_status (status)
);

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
);

CREATE TABLE IF NOT EXISTS carnet_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(120),
    postal_code VARCHAR(10),
    country VARCHAR(120),
    nif VARCHAR(20),
    numero_socio VARCHAR(50),
    amount DECIMAL(10, 2) DEFAULT 5.00,
    payment_intent_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    shipping_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_carnet_email (email),
    INDEX idx_carnet_status (status),
    INDEX idx_carnet_created_at (created_at)
);
