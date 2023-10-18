package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.jwt.RefreshToken;
import com.jwcg.groogroo.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccessTokenService {

    private final RefreshTokenRepository tokenRepository;

    @Transactional
    public void saveTokenInfo(String email, String refreshToken, String accessToken) {
        tokenRepository.save(new RefreshToken(email, accessToken, refreshToken));
    }
}