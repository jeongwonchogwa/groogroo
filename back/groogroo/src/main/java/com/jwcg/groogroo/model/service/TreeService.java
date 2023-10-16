package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.entity.Tree;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.repository.TreeRepository;
import com.jwcg.groogroo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class TreeService {

    private final UserRepository userRepository;
    private final TreeRepository treeRepository;

    public void makeMainTree(long userId, String imageUrl) {
        User user = userRepository.findUserById(userId);
        Tree tree = Tree.builder()
                .user(user)
                .imageUrl(imageUrl)
                .build();
        user.setTree(tree);

        userRepository.save(user);
        treeRepository.save(tree);
    }

    public void modifyMainTreeImage(long userId, String imageUrl) {
        Tree tree = treeRepository.findTreeByUserId(userId);
        tree.setImageUrl(imageUrl);

        treeRepository.save(tree);
    }

    public Tree getMainTreeContents(long userId) {
        return treeRepository.findTreeByUserId(userId);
    }
}
