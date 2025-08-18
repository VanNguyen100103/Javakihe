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

    public void notifyUser(User user, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        try {
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    public void notifyCollaborators(Event event, List<User> collaborators) {
        for (User collaborator : collaborators) {
            sendEventNotification(collaborator, event, "Collaborating Shelter",
                "You are collaborating on the event: " + event.getTitle(),
                "Please coordinate with the main shelter for event preparation.");
        }
    }

    public void notifyCollaborationRequest(User mainShelter, User invitedShelter, Event event) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(invitedShelter.getEmail());
        mailMessage.setSubject("Collaboration Request - " + event.getTitle());
        mailMessage.setText(
            "Hello " + invitedShelter.getFullName() + ",\n\n" +
            mainShelter.getFullName() + " has invited you to collaborate on their event: " + event.getTitle() + "\n\n" +
            "Event Details:\n" +
            "- Title: " + event.getTitle() + "\n" +
            "- Description: " + event.getDescription() + "\n" +
            "- Date: " + event.getDate() + "\n" +
            "- Location: " + event.getLocation() + "\n" +
            "- Time: " + event.getStartTime() + " - " + event.getEndTime() + "\n\n" +
            "Please log in to your account to accept or reject this collaboration request.\n\n" +
            "Best regards,\n" +
            "PawFund Team"
        );

        try {
            mailSender.send(mailMessage);
        } catch (Exception e) {
            System.err.println("Failed to send collaboration request email: " + e.getMessage());
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

        public void notifyShelters(Object event, List<User> shelters) {
            // TODO: Implement actual notification logic for multiple shelters
            for (User shelter : shelters) {
                notifyUser(shelter, "Event Update", "An event you are involved in has been updated");
            }
        }
    }
