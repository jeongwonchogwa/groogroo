package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Garden;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GardenRepository extends JpaRepository<Garden, Long> {

    Garden findGardenById(long gardenId);

    boolean existsByUrl(String url);
}
