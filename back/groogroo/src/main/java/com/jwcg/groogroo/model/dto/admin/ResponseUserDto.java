package com.jwcg.groogroo.model.dto.admin;

import com.jwcg.groogroo.model.entity.UserRole;
import com.jwcg.groogroo.model.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUserDto {
    private Long userId;
    private String email;
    private UserStatus userStatus;
    private UserRole userRole;
    private LocalDateTime createTime;
    private String provider;
}
