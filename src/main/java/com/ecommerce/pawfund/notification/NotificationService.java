package com.ecommerce.pawfund.notification;

import com.ecommerce.pawfund.entity.Event;
import com.ecommerce.pawfund.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void notifyShelters(Event event, List<User> shelters) {
        for (User shelter : shelters) {
            sendEventNotification(shelter, event, "Nhân viên cứu hộ",
                "Bạn đã được phân công phụ trách sự kiện: " + event.getTitle(),
                "Vui lòng có mặt sớm nhất để chuẩn bị và sắp xếp công việc.");
        }
    }

    public void notifyVolunteers(Event event, List<User> volunteers) {
        for (User volunteer : volunteers) {
            sendEventNotification(volunteer, event, "Tình nguyện viên",
                "Bạn đã được mời tham gia sự kiện: " + event.getTitle(),
                "Vui lòng có mặt đúng giờ để hỗ trợ sự kiện.");
        }
    }

    public void notifyDonors(Event event, List<User> donors) {
        for (User donor : donors) {
            sendEventNotification(donor, event, "Nhà tài trợ",
                "Bạn đã được mời tài trợ sự kiện: " + event.getTitle(),
                "Bạn có thể đến muộn hơn một chút để tham gia phần tài trợ.");
        }
    }

    private void sendEventNotification(User user, Event event, String role, String message, String timingInfo) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Thông báo sự kiện - " + event.getTitle());
        mailMessage.setText(
            "Xin chào " + user.getFullName() + ",\n\n" +
            message + "\n\n" +
            "Chi tiết sự kiện:\n" +
            "- Tiêu đề: " + event.getTitle() + "\n" +
            "- Mô tả: " + event.getDescription() + "\n" +
            "- Ngày: " + event.getDate() + "\n" +
            "- Địa điểm: " + event.getLocation() + "\n" +
            "- Thời gian: " + event.getStartTime() + " - " + event.getEndTime() + "\n" +
            "- Số người tối đa: " + event.getMaxParticipants() + "\n\n" +
            "Vai trò: " + role + "\n" +
            "Lưu ý thời gian: " + timingInfo + "\n\n" +
            "Trân trọng,\n" +
            "PawFund Team"
        );

        try {
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
        }
    }
} 