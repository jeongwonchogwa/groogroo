package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.UserGarden;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserGardenRepository extends JpaRepository<UserGarden, Long> {
    UserGarden findUserGardenByUserIdAndGardenId(long userId, long gardenId);
//    UserGarden findUserGardenByUserIdAndFlowerId(long userId, long flowerId);
    @Query("SELECT ug FROM UserGarden ug JOIN ug.flowers f WHERE ug.user.id = :userId AND f.id = :flowerId")
    UserGarden findUserGardenByUserIdAndFlowerId(@Param("userId") long userId, @Param("flowerId") long flowerId);
}
