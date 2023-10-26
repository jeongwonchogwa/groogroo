package com.jwcg.groogroo;

import com.jwcg.groogroo.model.entity.GardenLike;
import com.jwcg.groogroo.model.service.GardenLikeService;
import com.jwcg.groogroo.repository.GardenLikeRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@SpringBootTest
@WebAppConfiguration
class GroogrooApplicationTests {

	@Autowired
	private GardenLikeRepository gardenLikeRepository;

	@Autowired
	private GardenLikeService gardenLikeService;


	/*
	좋아요 - Redis 관련 테스트 영역
	1. GardenLike id -> userId/gardenId 형식으로 변경
	 */
	@Test
	public void redisBasicSave() {
		// given
		Long userId = 1L;
		Long gardenId = 1L;

		GardenLike savedGardenLike = GardenLike.builder()
				.id(userId + "/" + gardenId)
				.userId(userId)
				.gardenId(gardenId)
				.build();

		// when
		gardenLikeRepository.save(savedGardenLike);

		// then
		GardenLike findGardenLike = gardenLikeRepository.findByUserIdAndGardenId(userId, gardenId);

		System.out.println(savedGardenLike.getId());
		System.out.println(savedGardenLike.getUserId());
		System.out.println(savedGardenLike.getGardenId());

		System.out.println(findGardenLike.getId());
		System.out.println(findGardenLike.getUserId());
		System.out.println(findGardenLike.getGardenId());

		Assertions.assertEquals(savedGardenLike.getUserId(), findGardenLike.getUserId());
		Assertions.assertEquals(savedGardenLike.getGardenId(), findGardenLike.getGardenId());
	}

	@Test
	public void redisDeleteTest() { gardenLikeRepository.deleteAll(); }

	@Test
	public void 레디스만료테스트() {

	}

	@Test
	public void 좋아요랭킹() {
		gardenLikeService.getGardenRankingByPagination(1, 0);
	}


}
