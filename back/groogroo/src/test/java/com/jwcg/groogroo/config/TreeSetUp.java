package com.jwcg.groogroo.config;

import com.jwcg.groogroo.model.entity.Tree;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.repository.TreeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TreeSetUp {

    @Autowired
    TreeRepository treeRepository;

    public Tree createTree(User user){
        Tree tree = Tree.builder()
                .name("테스트용 나무")
                .user(user)
                .imageUrl("imageUrl")
                .build();

        return treeRepository.save(tree);
    }
}
