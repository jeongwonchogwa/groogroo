package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByReceiverId(long receiverId);

    Notification findNotificationById(long notificationId);
}
