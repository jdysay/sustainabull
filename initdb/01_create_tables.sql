CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,                
    username VARCHAR(50) UNIQUE NOT NULL, 
    last_name VARCHAR(100) NOT NULL,       
    first_name VARCHAR(100) NOT NULL,      
    passwords TEXT NOT NULL,               
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);
