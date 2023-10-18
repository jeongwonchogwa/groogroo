package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.jwt.RefreshToken;
import com.jwcg.groogroo.repository.RefreshTokenRepository;
import com.jwcg.groogroo.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository tokenRepository;
    private final JwtUtil jwtUtil;

//    @Transactional
//    public void deleteRefreshToken(String accessToken, SecurityUser userDto) {
//        log.info("토큰: {}",accessToken);
//        log.info("SecurityUser: {}", userDto);
//        RefreshToken token = tokenRepository.findByAccessToken(accessToken)
//                .orElseThrow(IllegalArgumentException::new);
//
//        tokenRepository.delete(token);
//    }
    @Transactional
    public void deleteRefreshToken(String accessToken) {
        RefreshToken token = tokenRepository.findByAccessToken(accessToken)
            .orElseThrow(IllegalArgumentException::new);

        tokenRepository.delete(token);
    }

    @Transactional
    public String republishAccessToken(String accessToken) {
        // 액세스 토큰으로 Refresh 토큰 객체를 조회
        Optional<RefreshToken> refreshToken = tokenRepository.findByAccessToken(accessToken);

        // RefreshToken이 존재하고 유효하다면 실행
        if (refreshToken.isPresent() && jwtUtil.verifyToken(refreshToken.get().getRefreshToken())) {
            // RefreshToken 객체를 꺼내온다.
            RefreshToken resultToken = refreshToken.get();
            // 권한과 아이디를 추출해 새로운 액세스토큰을 만든다.
            Long userId = jwtUtil.getId(resultToken.getAccessToken());
            String newAccessToken = jwtUtil.generateAccessToken(userId ,resultToken.getId(), jwtUtil.getRole(resultToken.getRefreshToken()));
            // 액세스 토큰의 값을 수정해준다.
            resultToken.updateAccessToken(newAccessToken);
            tokenRepository.save(resultToken);
            // 새로운 액세스 토큰을 반환해준다.
            return newAccessToken;
        }

        return null;
    }
}