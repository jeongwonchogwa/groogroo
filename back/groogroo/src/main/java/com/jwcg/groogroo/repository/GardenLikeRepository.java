package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.GardenLike;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GardenLikeRepository extends CrudRepository<GardenLike, String> {

    GardenLike findByUserIdAndGardenId(long userId, long gardenId);

    boolean existsByUserIdAndGardenId(long userId, long gardenId);

    boolean existsByUserId(long userId);
    boolean existsByGardenId(long gardenId);

    List<GardenLike> findAllByUserId(long userId);

    List<GardenLike> findAllByGardenId(long gardenId);

    @Query("SELECT COUNT(gl) FROM GardenLike gl WHERE gl.gardenId = :gardenId")
    Long countByGardenId(@Param("gardenId") long gardenId);

    List<GardenLike> findAll();
}
