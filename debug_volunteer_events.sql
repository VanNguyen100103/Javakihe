-- Debug script để kiểm tra volunteer events

-- 1. Kiểm tra user volunteer1
SELECT id, username, email, full_name, role FROM users WHERE username = 'volunteer1';

-- 2. Kiểm tra event_volunteers cho user volunteer1
SELECT 
    ev.event_id,
    ev.volunteer_id,
    e.title,
    e.description,
    u.username as volunteer_username
FROM event_volunteers ev
JOIN events e ON ev.event_id = e.id
JOIN users u ON ev.volunteer_id = u.id
WHERE u.username = 'volunteer1';

-- 3. Kiểm tra tất cả events được gán cho volunteer1
SELECT 
    e.id,
    e.title,
    e.description,
    e.status,
    e.date,
    e.category
FROM events e
JOIN event_volunteers ev ON e.id = ev.event_id
JOIN users u ON ev.volunteer_id = u.id
WHERE u.username = 'volunteer1';

-- 4. Kiểm tra notifications cho volunteer1
SELECT 
    n.id,
    n.title,
    n.message,
    n.type,
    n.is_read,
    n.created_at,
    u.username
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE u.username = 'volunteer1'
ORDER BY n.created_at DESC;

-- 5. Kiểm tra tất cả event_volunteers
SELECT 
    ev.event_id,
    ev.volunteer_id,
    e.title,
    u.username as volunteer_username
FROM event_volunteers ev
JOIN events e ON ev.event_id = e.id
JOIN users u ON ev.volunteer_id = u.id
ORDER BY ev.event_id; 