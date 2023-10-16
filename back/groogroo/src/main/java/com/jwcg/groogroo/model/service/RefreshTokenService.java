package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.entity.RefreshToken;
import com.jwcg.groogroo.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken save(RefreshToken refreshToken) {
        return refreshTokenRepository.save(refreshToken);
    }

    public void delete(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
}