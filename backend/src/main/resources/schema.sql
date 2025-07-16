-- Create database (run this separately)
-- CREATE DATABASE pawfund;

-- Connect to database
-- \c pawfund;

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS email_verifications;
DROP TABLE IF EXISTS pet_tag_relations;
DROP TABLE IF EXISTS pet_tags;
DROP TABLE IF EXISTS pet_images;
DROP TABLE IF EXISTS adoption_history;
DROP TABLE IF EXISTS adoption_requests;
DROP TABLE IF EXISTS donations;
DROP TABLE IF EXISTS recurring_donations;
DROP TABLE IF EXISTS donation_campaigns;
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS reported_issues;
DROP TABLE IF EXISTS volunteer_profiles;
DROP TABLE IF EXISTS shelter_profiles;
DROP TABLE IF EXISTS pets;
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

-- Create shelter profiles
CREATE TABLE shelter_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    description TEXT,
    capacity INT,
    facilities TEXT[],
    requirements TEXT,
    operating_hours TEXT,
    emergency_contact VARCHAR(100),
    website_url TEXT,
    social_media JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create volunteer profiles
CREATE TABLE volunteer_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    skills TEXT[],
    availability TEXT,
    experience TEXT,
    status VARCHAR(20) NOT NULL,
    total_hours INT DEFAULT 0,
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

-- Create pet images table
CREATE TABLE pet_images (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL REFERENCES pets(id),
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pet tags for improved search
CREATE TABLE pet_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE pet_tag_relations (
    pet_id BIGINT NOT NULL REFERENCES pets(id),
    tag_id BIGINT NOT NULL REFERENCES pet_tags(id),
    PRIMARY KEY (pet_id, tag_id)
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

-- Create adoption history
CREATE TABLE adoption_history (
    id BIGSERIAL PRIMARY KEY,
    adoption_request_id BIGINT NOT NULL REFERENCES adoption_requests(id),
    status_change VARCHAR(20) NOT NULL,
    notes TEXT,
    changed_by BIGINT NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Create donation campaigns
CREATE TABLE donation_campaigns (
    id BIGSERIAL PRIMARY KEY,
    shelter_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recurring donations
CREATE TABLE recurring_donations (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT NOT NULL REFERENCES users(id),
    shelter_id BIGINT NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    next_payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Create event registrations
CREATE TABLE event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    check_in_time TIMESTAMP,
    notes TEXT
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

-- Create reported issues
CREATE TABLE reported_issues (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT REFERENCES users(id),
    issue_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    resolved_by BIGINT REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity logs
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create email verification
CREATE TABLE email_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    token VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create all indexes
CREATE INDEX idx_pets_shelter ON pets(shelter_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pet_images_pet ON pet_images(pet_id);
CREATE INDEX idx_adoption_requests_pet ON adoption_requests(pet_id);
CREATE INDEX idx_adoption_requests_adopter ON adoption_requests(adopter_id);
CREATE INDEX idx_adoption_requests_status ON adoption_requests(status);
CREATE INDEX idx_adoption_history_request ON adoption_history(adoption_request_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_shelter ON donations(shelter_id);
CREATE INDEX idx_donation_campaigns_shelter ON donation_campaigns(shelter_id);
CREATE INDEX idx_recurring_donations_donor ON recurring_donations(donor_id);
CREATE INDEX idx_recurring_donations_shelter ON recurring_donations(shelter_id);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_volunteer_profiles_user ON volunteer_profiles(user_id);
CREATE INDEX idx_shelter_profiles_user ON shelter_profiles(user_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_reported_issues_reporter ON reported_issues(reporter_id);
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id);
CREATE INDEX idx_email_verifications_token ON email_verifications(token);

-- Create all triggers
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

CREATE TRIGGER update_volunteer_profile_updated_at
    BEFORE UPDATE ON volunteer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shelter_profile_updated_at
    BEFORE UPDATE ON shelter_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_campaign_updated_at
    BEFORE UPDATE ON donation_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_donation_updated_at
    BEFORE UPDATE ON recurring_donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reported_issue_updated_at
    BEFORE UPDATE ON reported_issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2a$10$yDPkHJJFe1UbxI85.Y/36eNW.9MvElUYwXjA.YqG9OY.PeHkwJ2Uy', 'admin@pawfund.com', 'System Admin', 'ADMIN');
