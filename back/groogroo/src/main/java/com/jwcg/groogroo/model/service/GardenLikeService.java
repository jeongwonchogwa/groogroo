package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.garden.ResponseGardenRankingDto;
import com.jwcg.groogroo.model.entity.Garden;
import com.jwcg.groogroo.model.entity.GardenLike;
import com.jwcg.groogroo.model.entity.UserGarden;
import com.jwcg.groogroo.repository.GardenLikeRepository;
import com.jwcg.groogroo.repository.GardenRepository;
import com.jwcg.groogroo.repository.UserGardenRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class GardenLikeService {

    private final int PAGESIZE = 10;

    private final GardenRepository gardenRepository;
    private final GardenLikeRepository gardenLikeRepository;
    private final UserGardenRepository userGardenRepository;

    /*
    좋아요
    userId, gardenId 를 파라미터로 저장한다.
    TO DO: 데이터 정합성을 위해 Set 사용
     */
    public void likeGarden(long userId, long gardenId) {
        GardenLike gardenLike = GardenLike.builder()
                .userId(userId)
                .gardenId(gardenId)
                .build();

        gardenLikeRepository.save(gardenLike);
    }

    /*
    좋아요 취소
    좋아요가 된 상태에서 한 번 더 버튼을 누르면 좋아요가 취소된다
     */
    public void cancelLikeGarden(long userId, long gardenId) {
        GardenLike gardenLike = gardenLikeRepository.findByUserIdAndGardenId(userId, gardenId);

        gardenLikeRepository.delete(gardenLike);
    }

    /*
    좋아요 여부 조회
    프론트에서 이 결과로 좋아요가 눌려있어서 좋아요 취소 버튼을 넣거나
    안 눌려 있는 상태에선 좋아요 버튼을 넣어줄 수 있음
     */
    @Transactional(readOnly = true)

    public boolean isLikeGarden(long userId, long gardenId) {
        return gardenLikeRepository.existsByUserIdAndGardenId(userId, gardenId);
    }

    /*
    좋아요 개수 조회
    특정 정원의 좋아요 개수를 리턴한다
     */
    @Transactional(readOnly = true)
    public long getGardenLikes(long gardenId) {
        return gardenLikeRepository.countByGardenId(gardenId);
    }

    /*
    좋아요한 정원 목록 조회
    현재는 사용하지 않지만 나중에 사용할 가능성 때문에 만듬
     */
    @Transactional(readOnly = true)
    public List<GardenLike> getLikedGarden(long userId) {
        return gardenLikeRepository.findAllByUserId(userId);
    }

    /*
    좋아요 랭킹 목록 조회 (페이징)
    페이지 번호와 페이지 크기를 받아 10개씩 좋아요 랭킹을 반환
    */
    @Transactional(readOnly = true)
    public Page<ResponseGardenRankingDto> getGardenRankingByPagination(long userId, int page) {
        Pageable pageable = PageRequest.of(page, PAGESIZE, Sort.by(Sort.Order.desc("likes")));

        List<GardenLike> gardenLikes = gardenLikeRepository.findAll();
        List<ResponseGardenRankingDto> gardens = new ArrayList<>();

        for (GardenLike gardenLike : gardenLikes) {
            Garden garden = gardenRepository.findGardenById(gardenLike.getGardenId());
            UserGarden userGarden = userGardenRepository.findUserGardenByUserIdAndGardenId(userId, garden.getId());

            ResponseGardenRankingDto responseGardenRankingDto = ResponseGardenRankingDto.builder()
                    .gardenId(garden.getId())
                    .name(garden.getName())
                    .description(garden.getDescription())
                    .state(userGarden.getJoinState().toString())
                    .capacity(garden.getCapacity())
                    .memberCnt(garden.getMemberCnt())
                    .likes(gardenLikeRepository.countByGardenId(garden.getId()))
                    .build();

            gardens.add(responseGardenRankingDto);
        }

        // gardens 리스트에서 페이지네이션 적용
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), gardens.size());

        List<ResponseGardenRankingDto> gardensOnPage = gardens.subList(start, end);

        return new PageImpl<>(gardensOnPage, pageable, gardens.size());
    }

}
