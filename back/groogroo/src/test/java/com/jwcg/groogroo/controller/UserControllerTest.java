package com.jwcg.groogroo.controller;

import com.jwcg.groogroo.common.BaseIntegrationTest;
import com.jwcg.groogroo.config.TreeSetUp;
import com.jwcg.groogroo.config.UserSetUp;
import com.jwcg.groogroo.model.dto.report.RequestReportDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.TreeRepository;
import com.jwcg.groogroo.repository.UserGardenRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * User 기능 통합 테스트
 */
class UserControllerTest extends BaseIntegrationTest {

    @Autowired
    UserSetUp userSetUp;

    @Autowired
    TreeSetUp treeSetUp;

    @MockBean
    UserGardenRepository userGardenRepository;

    @Test
    @DisplayName("로그아웃")
    public void logout() throws Exception {
        // Given
        String accessToken = userSetUp.userLogin();

        // When
        ResultActions result = mvc.perform(post("/user")
                .header("Authorization", "Bearer " + accessToken));

        //Then
        result.andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("토큰 재발급")
    public void republishToken() throws Exception {
        //Given
        String accessToken = userSetUp.userLogin();

        //when
        ResultActions result = mvc.perform(post("/user/refresh")
                .header("Authorization", "Bearer " + accessToken));

        //Then
        result.andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("회원 탈퇴")
    public void withdrawSuccess() throws Exception {
        //given
        String accessToken = userSetUp.userLogin();

        //when
        ResultActions result = mvc.perform(patch("/user")
                .header("Authorization", "Bearer " + accessToken));

        //then
        result.andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("회원 탈퇴 실패_정원의 마스터인 경우")
    public void withdrawCustomException() throws Exception {
        // Given
        String accessToken = userSetUp.userLogin();
        long userId = userSetUp.getId(accessToken);

        List<UserGarden> userGardens = new ArrayList<>();
        UserGarden userGarden = new UserGarden();
        userGarden.setGardenRole(GardenRole.MASTER);
        userGardens.add(userGarden);

        when(userGardenRepository.findAllByUserId(userId)).thenReturn(userGardens);

        // When
        ResultActions result = mvc.perform(patch("/user")
                .header("Authorization", "Bearer " + accessToken));

        // Then
        result.andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("신고하기")
    public void reportSuccess() throws Exception {
        // Given
        String accessToken = userSetUp.userLogin();
        
        // 신고할 User와 Tree 생성
        User testUser = userSetUp.createTestUser();
        Tree tree = treeSetUp.createTree(testUser);


        // DTO 생성
        RequestReportDto requestReportDto = RequestReportDto.builder()
                .content("신고합니다!!")
                .contentType(ContentType.TREE)
                .targetId(tree.getId())
                .build();


        // When
        ResultActions result = mvc.perform(post("/user/report")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestReportDto)));

        // Then
        result.andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("신고하기 실패_존재하지 않는 대상 신고한 경우")
    public void reportFailure() throws Exception {
        // Given
        String accessToken = userSetUp.userLogin();

        // DTO 생성 (존재 하지 않는 나무 신고)
        RequestReportDto requestReportDto = RequestReportDto.builder()
                .content("신고합니다!!")
                .contentType(ContentType.TREE)
                .targetId(100L)
                .build();

        // When
        ResultActions result = mvc.perform(post("/user/report")
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestReportDto)));

        // Then
        result.andDo(print())
                .andExpect(status().isNotFound());
    }
}