-- Kiểm tra cấu trúc bảng events
\d events;

-- Kiểm tra các bảng join
\d event_shelters;
\d event_volunteers;
\d event_donors;

-- Kiểm tra dữ liệu trong bảng join
SELECT * FROM event_shelters;
SELECT * FROM event_volunteers;
SELECT * FROM event_donors;

-- Kiểm tra sự kiện mới nhất
SELECT * FROM events WHERE id = 9; 