package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.MySQLGardenLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MySQLGardenLikeRepository extends JpaRepository<MySQLGardenLike, Long> {

    boolean existsByUserIdAndGardenId(long userId, long gardenId);

    MySQLGardenLike findByUserIdAndGardenId(long userId, long gardenId);

    List<MySQLGardenLike> findAllByGardenId(long gardenId);

    List<MySQLGardenLike> findAllByUserId(long userId);

}
