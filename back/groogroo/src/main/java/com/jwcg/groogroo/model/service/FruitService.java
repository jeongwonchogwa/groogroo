package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.entity.Fruit;
import com.jwcg.groogroo.repository.FruitRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class FruitService {

    private final FruitRepository fruitRepository;

    List<Fruit> getAllFruitsByTreeId(long treeId){
        return fruitRepository.findAllByTreeId(treeId);
    }

}
