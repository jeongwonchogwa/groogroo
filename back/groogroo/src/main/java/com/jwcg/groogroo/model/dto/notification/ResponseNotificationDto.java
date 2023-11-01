package com.jwcg.groogroo.model.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseNotificationDto {
    private Long id;
    private String content;
    private Long gardenId;
    private Long contentId;
    private boolean isRead;
    private String type;
}
