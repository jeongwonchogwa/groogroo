package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.Garden.ResponseGardenInfoDto;
import com.jwcg.groogroo.model.dto.Garden.ResponseUserGardenDto;
import com.jwcg.groogroo.model.dto.flower.ResponseFlowerPosDto;
import com.jwcg.groogroo.model.dto.tree.ResponseTreePosDto;
import com.jwcg.groogroo.model.entity.*;
import com.jwcg.groogroo.repository.GardenRepository;
import com.jwcg.groogroo.repository.TreeGardenRepository;
import com.jwcg.groogroo.repository.UserGardenRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
@AllArgsConstructor
public class GardenService {

    private final GardenRepository gardenRepository;
    private final UserRepository userRepository;
    private final UserGardenRepository userGardenRepository;
    private final TreeGardenRepository treeGardenRepository;

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

        if(!gardenRepository.existsByUrl(URL.toString())) return URL.toString();
        else return makeURL();
    }

    public void makeGarden(long userId, String name, String description, int x, int y, String imageUrl){

        // url 생성
        String url = makeURL();
        User user = userRepository.findUserById(userId);

        Garden garden = Garden.builder()
                .name(name)
                .description(description)
                .url(url)
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
        log.info(userGarden.getUser().toString());
        log.info(userGarden.getGarden().toString());
        try {
            userGardenRepository.save(userGarden);
            log.info("userGarden 저장 성공");
        } catch (Exception e) {
            log.info(e.getMessage());
        }


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

        try {
            treeGardenRepository.save(treeGarden);
            log.info("treeGarden 저장 성공");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public ResponseGardenInfoDto getGardenInfo(long gardenId) {
        Garden garden = gardenRepository.findGardenById(gardenId);
        List<TreeGarden> treeInfo = garden.getTreeGardens();
        List<UserGarden> flowerInfo = garden.getUserGardens();

        ResponseGardenInfoDto responseGardenInfoDto = ResponseGardenInfoDto.builder()
                .name(garden.getName())
                .description(garden.getDescription())
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
            for (Flower flower : userGarden.getFlowers()){
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

    @Transactional(readOnly = true)
    public List<ResponseUserGardenDto> getUserGarden(long userId) {
        List<UserGarden> userGardens = userGardenRepository.findAllByUserId(userId);
        List<ResponseUserGardenDto> returnData = new ArrayList<>();

        for(UserGarden userGarden : userGardens) {
            JoinState joinState = userGarden.getJoinState();
            if (joinState.equals(JoinState.WAIT) || joinState.equals(JoinState.ACCEPT)){
                ResponseUserGardenDto responseUserGardenDto = ResponseUserGardenDto.builder()
                        .gardenId(userGarden.getGarden().getId())
                        .name(userGarden.getGarden().getName())
                        .description(userGarden.getGarden().getDescription())
                        .state(joinState.toString())
                        .build();

                returnData.add(responseUserGardenDto);
            }
        }

        return returnData;
    }

    public void changeRoleFromMaster(long userId, String role, long gardenId, long targetId){

        UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, gardenId);
        UserGarden targetUserGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(targetId, gardenId);

        log.info("Garden Service - 직책 변경 " + gardenId + " -> "+ role);
        if(role.equals("MASTER")) {
            userGarden.setGardenRole(GardenRole.MEMBER);
            targetUserGarden.setGardenRole(GardenRole.MASTER);
        }else if(role.equals("ADMIN")) {
            targetUserGarden.setGardenRole(GardenRole.ADMIN);
        }else {
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
}
