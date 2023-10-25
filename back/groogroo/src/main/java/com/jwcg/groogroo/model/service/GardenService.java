package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.garden.ResponseGardenInfoDto;
import com.jwcg.groogroo.model.dto.garden.ResponseUserGardenDto;
import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
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
                .gardenRole(GardenRole.ADMIN)
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
            if (joinState.equals(JoinState.WAIT) || joinState.equals(JoinState.ACCEPT)) {
                Garden garden = userGarden.getGarden();
                ResponseUserGardenDto responseUserGardenDto = ResponseUserGardenDto.builder()
                        .gardenId(garden.getId())
                        .name(userGarden.getGarden().getName())
                        .description(userGarden.getGarden().getDescription())
                        .state(joinState.toString())
                        .capacity(userGarden.getGarden().getCapacity())
                        .memberCnt(userGarden.getGarden().getMemberCnt())
                        .likes(gardenLikeRepository.countByGardenId(garden.getId()))
                        .build();

                returnData.add(responseUserGardenDto);
            }
        }

        // 페이지네이션 적용
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), returnData.size());

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

    public void updateUserGardenState(Long userId, Long gardenId) {
        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        UserGarden updatedUserGarden = UserGarden.builder()
                .id(userGarden.getId())
                .gardenRole(userGarden.getGardenRole())
                .joinState(JoinState.KICK)
                .deleteDate(null)
                .flowers(userGarden.getFlowers())
                .user(userGarden.getUser())
                .garden(userGarden.getGarden())
                .build();
        userGardenRepository.save(updatedUserGarden);
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
}
