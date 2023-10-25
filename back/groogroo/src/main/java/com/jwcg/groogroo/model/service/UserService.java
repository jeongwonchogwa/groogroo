package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.user.ResponseUserDto;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    // 유저 목록 10개씩 조회
    public List<ResponseUserDto> getUserList(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by(Sort.Order.asc("id")));

        List<User> list =  userRepository.findAll(pageable).getContent();

        List<ResponseUserDto> responseList = new ArrayList<>();

        for(User user : list){
            ResponseUserDto responseUserDto = ResponseUserDto.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .userStatus(user.getUserStatus())
                    .userRole(user.getUserRole())
                    .createTime(user.getCreateTime())
                    .provider(user.getProvider())
                    .build();
            responseList.add(responseUserDto);
        }
        return responseList;
    }
}
