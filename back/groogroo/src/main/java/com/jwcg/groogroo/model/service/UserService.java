package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.user.ResponseUserDto;
import com.jwcg.groogroo.model.entity.GardenRole;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserGarden;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.repository.UserGardenRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserGardenRepository userGardenRepository;

    public void updateStatus(Long userId, UserStatus userStatus) {
        // 탈퇴 하려는 경우 MASTER로 속해있는 정원이 있는지 확인 => 있으면 예외 발생
        if(userStatus == UserStatus.WITHDRAWAL){
            List<UserGarden> userGardens = userGardenRepository.findAllByUserId(userId);
            for(UserGarden userGarden : userGardens){
                if(userGarden.getGardenRole() == GardenRole.MASTER){
                    throw new CustomException(HttpStatus.FORBIDDEN, "회원 탈퇴 실패 - MASTER 권한 위임 후 탈퇴 가능");
                }
            }
        }

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
    @Transactional(readOnly = true)
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
