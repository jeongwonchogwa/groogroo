package com.jwcg.groogroo.model.dto.user;

import lombok.*;

@NoArgsConstructor
@Getter
@ToString
@AllArgsConstructor
@Builder
public class SecurityUserDto {
    private Long id;
    private String email;
    private String role;
}
