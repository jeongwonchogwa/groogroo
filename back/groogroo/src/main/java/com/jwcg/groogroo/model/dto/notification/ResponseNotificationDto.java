package com.jwcg.groogroo.model.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseNotificationDto {
    private Long id;
    private String name;
    private String content;
    private Long gardenId;
    private Long contentId;
    private boolean isRead;
    private String type;
    private LocalDateTime createTime;
}
