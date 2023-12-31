package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.Fruit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FruitRepository extends JpaRepository<Fruit, Long> {

    Fruit findFruitById(long fruitId);


    List<Fruit> findAllByTreeIdAndDeleteDateIsNull(long treeId);
}
