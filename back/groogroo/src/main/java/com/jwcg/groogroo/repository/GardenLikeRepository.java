package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.GardenLike;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GardenLikeRepository extends CrudRepository<GardenLike, Long> {

    GardenLike findByUserIdAndGardenId(long userId, long gardenId);

    boolean existsByUserIdAndGardenId(long userId, long gardenId);

    List<GardenLike> findAllByUserId(long userId);

    List<GardenLike> findAllByGardenId(long gardenId);

    long countByGardenId(long gardenId);

    List<GardenLike> findAll();
}
