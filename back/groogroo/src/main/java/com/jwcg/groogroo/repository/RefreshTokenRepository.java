package com.jwcg.groogroo.repository;

import com.jwcg.groogroo.model.dto.jwt.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    // accessToken으로 RefreshToken 조회
    Optional<RefreshToken> findByAccessToken(String accessToken);
}