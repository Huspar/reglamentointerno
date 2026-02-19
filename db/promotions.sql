CREATE TABLE IF NOT EXISTS builder_promotions (
    id SERIAL PRIMARY KEY,
    fix_code TEXT UNIQUE NOT NULL,
    presence_rate DOUBLE PRECISION NOT NULL,
    window_days INTEGER DEFAULT 30,
    promoted BOOLEAN DEFAULT TRUE,
    promoted_at TIMESTAMP DEFAULT NOW()
);
