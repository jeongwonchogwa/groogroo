package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.UserGarden;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGardenRepository extends JpaRepository<UserGarden, Long> {
    UserGarden findUserGardenByUserIdAndGardenId(long userId, long gardenId);
}
