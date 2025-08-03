-- Debug script để kiểm tra user và role

-- 1. Kiểm tra user shelter1
SELECT id, username, email, full_name, role FROM users WHERE username = 'shelter1';

-- 2. Kiểm tra event_shelters cho user shelter1
SELECT 
    es.event_id,
    es.shelter_id,
    e.title,
    e.description,
    u.username as shelter_username
FROM event_shelters es
JOIN events e ON es.event_id = e.id
JOIN users u ON es.shelter_id = u.id
WHERE u.username = 'shelter1';

-- 3. Kiểm tra tất cả events được gán cho shelter1
SELECT 
    e.id,
    e.title,
    e.description,
    e.status,
    e.date
FROM events e
JOIN event_shelters es ON e.id = es.event_id
JOIN users u ON es.shelter_id = u.id
WHERE u.username = 'shelter1';

-- 4. Kiểm tra notifications cho shelter1
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
WHERE u.username = 'shelter1'
ORDER BY n.created_at DESC; 