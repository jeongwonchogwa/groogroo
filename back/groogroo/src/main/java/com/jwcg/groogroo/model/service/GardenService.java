package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.exception.CustomException;
import com.jwcg.groogroo.model.dto.garden.ResponseGardenInfoDto;
import com.jwcg.groogroo.model.dto.garden.ResponseUserGardenDto;
import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import com.jwcg.groogroo.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
@AllArgsConstructor
public class GardenService {

    private final int PAGESIZE = 10;

    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;
    private final UserGardenRepository userGardenRepository;
    private final TreeGardenRepository treeGardenRepository;
    private final GardenLikeRepository gardenLikeRepository;
    private final JwtUtil jwtUtil;

    public String makeURL() {
        StringBuffer URL = new StringBuffer();
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            int index = random.nextInt(3);

            switch (index) {
                case 0:
                    // a ~ z
                    URL.append((char) ((int) (random.nextInt(26)) + 97));
                    break;
                case 1:
                    // A ~ Z
                    URL.append((char) ((int) (random.nextInt(26) + 65)));
                    break;
                case 2:
                    // 0 ~ 9
                    URL.append((random.nextInt(10)));
                    break;
            }
        }

        if (!gardenRepository.existsByUrl(URL.toString())) return URL.toString();
        else return makeURL();
    }

    public void makeGarden(long userId, String name, String description, int x, int y, String imageUrl, int capacity){

        // url 생성
        String url = makeURL();
        User user = userRepository.findUserById(userId);

        Garden garden = Garden.builder()
                .name(name)
                .description(description)
                .url(url)
                .capacity(capacity)
                .memberCnt(1)
                .build();
        log.info("garden 저장 성공");
        gardenRepository.save(garden);

        // 생성한 사람과 그 나무를 해당 정원에 등록(관리자)
        UserGarden userGarden = UserGarden.builder()
                .gardenRole(GardenRole.MASTER)
                .joinState(JoinState.ACCEPT)
                .build();

        userGarden.setUser(user);
        userGarden.setGarden(garden);

        log.info("userGarden 생성 성공");
        userGardenRepository.save(userGarden);

        TreeGarden treeGarden = TreeGarden.builder()
                .x(x)
                .y(y)
                .imageUrl(imageUrl)
                .build();

        log.info("treeGarden setGarden");
        treeGarden.setGarden(garden);
        log.info("treeGarden setTree");
        treeGarden.setTree(user.getTree());

        log.info("treeGarden 생성 성공" + treeGarden.getGarden().toString());
        log.info(treeGarden.getTree().toString());

        treeGardenRepository.save(treeGarden);
        log.info("treeGarden 저장 성공");

    }

    @Transactional(readOnly = true)
    public ResponseGardenInfoDto getGardenInfo(long userId, long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        List<TreeGarden> treeInfo = garden.getTreeGardens();
        List<UserGarden> flowerInfo = garden.getUserGardens();


        ResponseGardenInfoDto responseGardenInfoDto = ResponseGardenInfoDto.builder()
                .gardenId(gardenId)
                .name(garden.getName())
                .description(garden.getDescription())
                .likes(gardenLikeRepository.countByGardenId(gardenId))
                .capacity(garden.getCapacity())
                .memberCnt(garden.getMemberCnt())
                .state(userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId).getJoinState().toString())
                .build();


        log.info("나무, 꽃 정보 확인 + 정원 dto 생성");
        // 나무 위치 정보 삽입
        for (TreeGarden treeGarden : treeInfo) {
            ResponseTreePosDto responseTreePosDto = ResponseTreePosDto.builder()
                    .id(treeGarden.getTree().getId())
                    .x(treeGarden.getX())
                    .y(treeGarden.getY())
                    .imageUrl(treeGarden.getImageUrl())
                    .build();

            log.info("나무 위치 정보: " + responseTreePosDto.toString());
            responseGardenInfoDto.setTreePos(new ArrayList<>());
            responseGardenInfoDto.getTreePos().add(responseTreePosDto);
        }

        // 꽃 위치 정보 삽입
        for (UserGarden userGarden : flowerInfo) {
            for (Flower flower : userGarden.getFlowers()) {
                ResponseFlowerPosDto responseFlowerPosDto = ResponseFlowerPosDto.builder()
                        .id(flower.getId())
                        .x(flower.getX())
                        .y(flower.getY())
                        .imageUrl(flower.getImageUrl())
                        .build();
                responseGardenInfoDto.setFlowerPos(new ArrayList<>());
                responseGardenInfoDto.getFlowerPos().add(responseFlowerPosDto);
                log.info("꽃 위치 정보: " + responseFlowerPosDto.toString());

            }
        }

        return responseGardenInfoDto;
    }

    /*
    사용자의 정원 목록 조회 (페이징)
    페이지 번호와 페이지 크기를 받아 10개씩 사용자의 정원 목록을 반환
    */
    @Transactional(readOnly = true)
    public Page<ResponseUserGardenDto> getUserGardenByPagination(long userId, int page) {
        Pageable pageable = PageRequest.of(page, PAGESIZE, Sort.by(Sort.Order.asc("state")));

        List<UserGarden> userGardens = userGardenRepository.findAllByUserId(userId);
        List<ResponseUserGardenDto> returnData = new ArrayList<>();

        for (UserGarden userGarden : userGardens) {
            JoinState joinState = userGarden.getJoinState();
            log.info(joinState.toString());
            if (joinState.equals(JoinState.WAIT) || joinState.equals(JoinState.ACCEPT)) {
                Garden garden = userGarden.getGarden();
                log.info(garden.toString());
//                long likes = gardenLikeRepository.countByGardenId(garden.getId());
                long likes = gardenLikeRepository.findAllByGardenId(garden.getId()).size();
                ResponseUserGardenDto responseUserGardenDto = ResponseUserGardenDto.builder()
                        .gardenId(garden.getId())
                        .name(garden.getName())
                        .description(garden.getDescription())
                        .state(joinState.toString())
                        .capacity(garden.getCapacity())
                        .memberCnt(garden.getMemberCnt())
                        .likes(likes)
                        .build();
                log.info(responseUserGardenDto.toString());
                returnData.add(responseUserGardenDto);
            }
        }

        // 페이지네이션 적용
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), returnData.size());

        log.info(Integer.toString(start));
        log.info(Integer.toString(end));

        List<ResponseUserGardenDto> userGardensOnPage = returnData.subList(start, end);

        return new PageImpl<>(userGardensOnPage, pageable, returnData.size());
    }

    public void changeRoleFromMaster(long userId, String role, long gardenId, long targetId) {

        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        UserGarden targetUserGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(targetId, gardenId);

        log.info("Garden Service - 직책 변경 " + gardenId + " -> " + role);
        if (role.equals("MASTER")) {
            userGarden.setGardenRole(GardenRole.MEMBER);
            targetUserGarden.setGardenRole(GardenRole.MASTER);
        } else if (role.equals("ADMIN")) {
            targetUserGarden.setGardenRole(GardenRole.ADMIN);
        } else {
            targetUserGarden.setGardenRole(GardenRole.MEMBER);
        }

        log.info(userGarden.getGardenRole().toString());
        log.info(targetUserGarden.getGardenRole().toString());

        userGardenRepository.save(userGarden);
        userGardenRepository.save(targetUserGarden);
    }

    @Transactional(readOnly = true)
    public String getGardenLink(long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);

        return garden.getUrl();
    }

    public void deleteGarden(Long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        List<UserGarden> userGardens = garden.getUserGardens();
        List<TreeGarden> treeGardens = garden.getTreeGardens();

        LocalDate now = LocalDate.now();

        for (UserGarden userGarden : userGardens) {
            userGarden.setDeleteDate(now);
        }

        for (TreeGarden treeGarden : treeGardens) {
            treeGarden.setDeleteDate(now);
        }

        Garden deletedGarden = Garden.builder()
                .id(garden.getId())
                .name(garden.getName())
                .description(garden.getDescription())
                .url(garden.getUrl())
                .deleteDate(garden.getDeleteDate())
                .userGardens(garden.getUserGardens())
                .treeGardens(garden.getTreeGardens())
                .build();

        gardenRepository.save(deletedGarden);
    }

    public void updateOthersJoinState(String token, Long userId, Long gardenId, String joinState) {
        token = token.split(" ")[1];
        Long id = jwtUtil.getId(token);
        String userRole = jwtUtil.getRole(token);

        // ADMIN계정이 아닌 일반 USER 계정인 경우 gardenRole 확인하기
        if(userRole.equals("USER")){
            GardenRole gardenRole = userGardenRepository.findUserGardenByUserIdAndGardenId(id, gardenId).getGardenRole();
            // GardenRole이 MASTER나 ADMIN이어야 joinState 변경 가능
            if(gardenRole == GardenRole.MEMBER){
                throw new CustomException(HttpStatus.FORBIDDEN, "JoinState 변경 실패 - 권한 없음");
            }
        }

        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        JoinState state = JoinState.WAIT;
        switch(joinState){
            case "ACCEPT":
                state = JoinState.ACCEPT;
                break;
            case "REFUSE":
                state = JoinState.REFUSE;
                break;
            case "KICK":
                state = JoinState.KICK;
        }

        updateJoinState(userGarden, state);
    }

    public void joinGarden(Long userId, long gardenId) {
        UserGarden userGarden = UserGarden.builder()
                .gardenRole(GardenRole.MEMBER)
                .joinState(JoinState.WAIT)
                .user(userRepository.findUserById(userId))
                .garden(gardenRepository.findGardenById(gardenId))
                .build();
        userGardenRepository.save(userGarden);
    }

    // 정원 가입 결과 조회 - WAIT, ACCEPT, REFUSE 인 정원 목록 반환
    public List<ResponseUserGardenDto> getGardenJoinStateList(Long userId) {

        List<UserGarden> userGardens = userGardenRepository.findAllByUserId(userId);
        List<ResponseUserGardenDto> list = new ArrayList<>();

        for (UserGarden userGarden : userGardens) {
            JoinState joinState = userGarden.getJoinState();
            if (joinState.equals(JoinState.WAIT) || joinState.equals(JoinState.ACCEPT) || joinState.equals(JoinState.REFUSE)) {
                ResponseUserGardenDto responseUserGardenDto = ResponseUserGardenDto.builder()
                        .gardenId(userGarden.getGarden().getId())
                        .name(userGarden.getGarden().getName())
                        .description(userGarden.getGarden().getDescription())
                        .state(joinState.toString())
                        .build();

                list.add(responseUserGardenDto);
            }
        }

        return list;
    }

    // 정원 탈퇴
    public void withdrawFromGarden(Long userId, Long gardenId) {
        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        GardenRole gardenRole = userGarden.getGardenRole();
        // MASTER면 탈퇴 불가 (다른 사람에게 위임해줘야함)
        if(gardenRole == GardenRole.MASTER) {
            throw new CustomException(HttpStatus.FORBIDDEN, "정원 탈퇴 실패 - MASTER는 탈퇴 불가");
        }
        updateJoinState(userGarden, JoinState.WITHDRAWAL);
    }

    // joinState를 변환하는 메서드
    private void updateJoinState(UserGarden userGarden, JoinState joinState) {
        UserGarden updatedUserGarden = UserGarden.builder()
                .id(userGarden.getId())
                .gardenRole(userGarden.getGardenRole())
                .joinState(joinState)
                .deleteDate(null)
                .flowers(userGarden.getFlowers())
                .user(userGarden.getUser())
                .garden(userGarden.getGarden())
                .build();

        userGardenRepository.save(updatedUserGarden);
    }
}
