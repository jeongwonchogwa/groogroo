package com.jwcg.groogroo.config;

import com.jwcg.groogroo.model.dto.jwt.GeneratedToken;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserRole;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.repository.UserRepository;
import com.jwcg.groogroo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserSetUp {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String userLogin() {
        User user = User.builder()
                .email("test@test.com")
                .userStatus(UserStatus.USER)
                .userRole(UserRole.USER)
                .createTime(LocalDateTime.now())
                .provider("test")
                .build();

        User savedUser = userRepository.save(user);

        GeneratedToken generatedToken = jwtUtil.generateToken(savedUser.getId(), user.getEmail(), "USER", savedUser.getTree().getId());

        System.out.println("accessToken: "+generatedToken.getAccessToken());
        System.out.println("refreshToken: "+generatedToken.getRefreshToken());

        return generatedToken.getAccessToken();
    }

    public String adminLogin() {
        User user = User.builder()
                .email("admin@test.com")
                .userStatus(UserStatus.USER)
                .userRole(UserRole.ADMIN)
                .createTime(LocalDateTime.now())
                .provider("test")
                .build();

        User savedUser = userRepository.save(user);
        GeneratedToken generatedToken = jwtUtil.generateToken(savedUser.getId(), user.getEmail(), "USER", savedUser.getTree().getId());

        System.out.println("accessToken: "+generatedToken.getAccessToken());
        System.out.println("refreshToken: "+generatedToken.getRefreshToken());

        return generatedToken.getAccessToken();
    }

    public Long getId(String accessToken){
       return jwtUtil.getId(accessToken);
    }

    public User createTestUser() {
        User user = User.builder()
                .email("test1@test.com")
                .userStatus(UserStatus.USER)
                .userRole(UserRole.USER)
                .createTime(LocalDateTime.now())
                .provider("test")
                .build();

        return userRepository.save(user);
    }

}
