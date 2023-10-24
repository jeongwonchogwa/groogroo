package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;

    public void updateStatus(Long userId, UserStatus userStatus) {
        User user = userRepository.findUserById(userId);
        User updatedUser = User.builder()
                .id(userId)
                .email(user.getEmail())
                .userStatus(userStatus)
                .userRole(user.getUserRole())
                .createTime(user.getCreateTime())
                .provider(user.getProvider())
                .tree(user.getTree())
                .userGardens(user.getUserGardens())
                .build();
        userRepository.save(updatedUser);
    }
}
