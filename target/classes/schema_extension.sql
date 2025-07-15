-- Add new tables and modifications for enhanced functionality

-- Add pet images table for multiple images per pet
CREATE TABLE pet_images (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL REFERENCES pets(id),
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add volunteer profiles
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

-- Add shelter profiles
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

-- Add donation campaigns
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

-- Add recurring donations
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

-- Add event registrations
CREATE TABLE event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    check_in_time TIMESTAMP,
    notes TEXT
);

-- Add adoption history
CREATE TABLE adoption_history (
    id BIGSERIAL PRIMARY KEY,
    adoption_request_id BIGINT NOT NULL REFERENCES adoption_requests(id),
    status_change VARCHAR(20) NOT NULL,
    notes TEXT,
    changed_by BIGINT NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add activity logs
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

-- Add reported issues
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

-- Add email verification
CREATE TABLE email_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    token VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add pet tags for improved search
CREATE TABLE pet_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE pet_tag_relations (
    pet_id BIGINT NOT NULL REFERENCES pets(id),
    tag_id BIGINT NOT NULL REFERENCES pet_tags(id),
    PRIMARY KEY (pet_id, tag_id)
);

-- Add indexes for new tables
CREATE INDEX idx_pet_images_pet ON pet_images(pet_id);
CREATE INDEX idx_volunteer_profiles_user ON volunteer_profiles(user_id);
CREATE INDEX idx_shelter_profiles_user ON shelter_profiles(user_id);
CREATE INDEX idx_donation_campaigns_shelter ON donation_campaigns(shelter_id);
CREATE INDEX idx_recurring_donations_donor ON recurring_donations(donor_id);
CREATE INDEX idx_recurring_donations_shelter ON recurring_donations(shelter_id);
CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_adoption_history_request ON adoption_history(adoption_request_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_reported_issues_reporter ON reported_issues(reporter_id);
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id);
CREATE INDEX idx_email_verifications_token ON email_verifications(token);

-- Add triggers for new timestamp columns
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
