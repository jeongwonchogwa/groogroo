package com.jwcg.groogroo.model.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "notification")
@Schema(description = "Notification")
@ToString(exclude = "receiver")
public class Notification{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @Column(nullable = false, name = "content")
    private String content;

    @Column(name = "garden_id")
    private Long gardenId;

    @Column(name = "content_id")
    private Long contentId;

    @Column(nullable = false, name = "is_read")
    private boolean isRead;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType notificationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User receiver;

    // setter
    public void setUser(User user){
        if (user != null) {
            if(user.getNotifications() == null) user.setNotifications(new ArrayList<>());
            user.getNotifications().remove(this);
        }
        this.receiver = user;
        assert user != null;
        user.getNotifications().add(this);
    }
}
