package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findUserById(long userId);

    User findByEmail(String email);
}
