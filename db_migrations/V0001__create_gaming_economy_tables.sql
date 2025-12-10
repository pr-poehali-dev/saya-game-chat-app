CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT '🎮',
    balance INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gifts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) DEFAULT 'common',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    payment_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gift_sends (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    gift_id INTEGER NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_gift_sends_sender ON gift_sends(sender_id);
CREATE INDEX idx_gift_sends_receiver ON gift_sends(receiver_id);