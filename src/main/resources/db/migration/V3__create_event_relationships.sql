-- Tạo bảng join cho event-shelter relationship
CREATE TABLE event_shelters (
    event_id BIGINT NOT NULL,
    shelter_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, shelter_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (shelter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng join cho event-volunteer relationship
CREATE TABLE event_volunteers (
    event_id BIGINT NOT NULL,
    volunteer_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, volunteer_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng join cho event-donor relationship
CREATE TABLE event_donors (
    event_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, donor_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Xóa các cột cũ nếu có
ALTER TABLE events DROP COLUMN IF EXISTS shelter_id;
ALTER TABLE events DROP COLUMN IF EXISTS volunteer_id; 