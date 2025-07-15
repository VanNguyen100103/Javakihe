-- Create database (run this separately)
-- CREATE DATABASE pawfund;

-- Connect to database
-- \c pawfund;

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS adoption_requests;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Create users table with integrated shelter and volunteer information
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    
    -- Shelter specific fields
    is_shelter BOOLEAN DEFAULT false,
    shelter_description TEXT,
    shelter_capacity INTEGER,
    operating_hours TEXT,
    emergency_contact VARCHAR(100),
    website_url TEXT,
    social_media JSONB,
    
    -- Volunteer specific fields
    is_volunteer BOOLEAN DEFAULT false,
    volunteer_status VARCHAR(20),
    skills TEXT,
    availability TEXT,
    volunteer_hours INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pets table
CREATE TABLE pets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    gender VARCHAR(20),
    description TEXT,
    health_status TEXT,
    image_url TEXT,
    status VARCHAR(20) NOT NULL,
    shelter_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create adoption_requests table
CREATE TABLE adoption_requests (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL REFERENCES pets(id),
    adopter_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL,
    reason TEXT,
    notes TEXT,
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP
);

-- Create donations table
CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT REFERENCES users(id),
    shelter_id BIGINT REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    donation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    image_url TEXT,
    organizer_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_pets_shelter ON pets(shelter_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_adoption_requests_pet ON adoption_requests(pet_id);
CREATE INDEX idx_adoption_requests_adopter ON adoption_requests(adopter_id);
CREATE INDEX idx_adoption_requests_status ON adoption_requests(status);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_shelter ON donations(shelter_id);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2a$10$yDPkHJJFe1UbxI85.Y/36eNW.9MvElUYwXjA.YqG9OY.PeHkwJ2Uy', 'admin@pawfund.com', 'System Admin', 'ADMIN');

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_updated_at
    BEFORE UPDATE ON pets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
