package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Flower;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlowerRepository extends JpaRepository<Flower, Long> {
    Flower findFlowerById(long flowerId);
}
