/**
users -> infomation about the user
walk log -> use id in users as reference -> you can see the data of the user from user id in walk_logs
**/

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gold INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE walk_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    walked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    distance_m FLOAT NOT NULL,
    route_geojson JSONB, -- saved as GeoJSON
    earned_coins INTEGER NOT NULL --earn coin somehow
);

CREATE TABLE cows (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    cow_name VARCHAR(100) NOT NULL, -- I donot define the default name of the cow
    cow_level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    mood INTEGER CHECK (mood BETWEEN 0 AND 100) DEFAULT 100,
    hunger INTEGER CHECK (hunger BETWEEN 0 AND 100) DEFAULT 100,
    co2_emissions INTEGER CHECK (co2_emissions BETWEEN 0 AND 100) DEFAULT 0,
    exercise INTEGER DEFAULT 0,
    alive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shop_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    price INTEGER NOT NULL,
    effect_element INTEGER NOT NULL,
    effect_value INTEGER,
    item_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES shop_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cow_decorations (
    id SERIAL PRIMARY KEY,
    cow_id INTEGER REFERENCES cows(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES shop_items(id) ON DELETE CASCADE,
    equipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

