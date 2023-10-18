package com.jwcg.groogroo.model.dto.user;

import lombok.*;

@NoArgsConstructor
@Getter
@ToString
@AllArgsConstructor
@Builder
public class SecurityUser {
    private Long id;
    private String email;
    private String role;
}
