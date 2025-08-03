-- Script để test và khắc phục vấn đề events

-- 1. Kiểm tra cấu trúc bảng events hiện tại
\d events;

-- 2. Tạo các bảng join nếu chưa có
CREATE TABLE IF NOT EXISTS event_shelters (
    event_id BIGINT NOT NULL,
    shelter_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, shelter_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (shelter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_volunteers (
    event_id BIGINT NOT NULL,
    volunteer_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, volunteer_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_donors (
    event_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    PRIMARY KEY (event_id, donor_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Xóa các cột cũ nếu có
ALTER TABLE events DROP COLUMN IF EXISTS shelter_id;
ALTER TABLE events DROP COLUMN IF EXISTS volunteer_id;

-- 4. Thêm dữ liệu test cho event ID 9
INSERT INTO event_shelters (event_id, shelter_id) VALUES (9, 3), (9, 5);
INSERT INTO event_volunteers (event_id, volunteer_id) VALUES (9, 4);
INSERT INTO event_donors (event_id, donor_id) VALUES (9, 6);

-- 5. Kiểm tra kết quả
SELECT 
    e.id,
    e.title,
    e.description,
    array_agg(DISTINCT es.shelter_id) as shelter_ids,
    array_agg(DISTINCT ev.volunteer_id) as volunteer_ids,
    array_agg(DISTINCT ed.donor_id) as donor_ids
FROM events e
LEFT JOIN event_shelters es ON e.id = es.event_id
LEFT JOIN event_volunteers ev ON e.id = ev.event_id
LEFT JOIN event_donors ed ON e.id = ed.event_id
WHERE e.id = 9
GROUP BY e.id, e.title, e.description; 