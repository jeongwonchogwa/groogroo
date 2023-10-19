package com.jwcg.groogroo.util;

import com.jwcg.groogroo.model.dto.jwt.GeneratedToken;
import com.jwcg.groogroo.model.dto.jwt.RefreshToken;
import com.jwcg.groogroo.repository.RefreshTokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtUtil {
    private final RefreshTokenRepository tokenRepository;

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${access-expiration-time}")
    private Long accessExpirationTime;

    @Value("${refresh-expiration-time}")
    private Long refreshExpirationTime;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    /**
     * accessToken & refreshToken 발급
     * @param id
     * @param email
     * @param role
     * @return
     */
    public GeneratedToken generateToken(Long id, String email, String role) {
        // refreshToken과 accessToken을 생성한다.
        String refreshToken = generateRefreshToken(id, email, role);
        String accessToken = generateAccessToken(id, email, role);

        // 토큰을 Redis에 저장한다.
        saveTokenInfo(email, refreshToken, accessToken);
        return new GeneratedToken(accessToken, refreshToken);
    }


    /**
     * RefreshToken 발급
     * @param id
     * @param email
     * @param role
     * @return
     */
    public String generateRefreshToken(Long id, String email, String role) {

        // 새로운 클레임 객체를 생성하고, 이메일과 역할(권한)을 셋팅
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("id", id);
        claims.put("role", role);

        // 현재 시간과 날짜를 가져온다.
        Date now = new Date();

        return Jwts.builder()
                // Payload를 구성하는 속성들을 정의한다.
                .setClaims(claims)
                // 발행일자를 넣는다.
                .setIssuedAt(now)
                // 토큰의 만료일시를 설정한다.
                .setExpiration(new Date(now.getTime() + refreshExpirationTime))
                // 지정된 서명 알고리즘과 비밀 키를 사용하여 토큰을 서명한다.
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }


    /**
     * AccessToken 발급
     * @param id
     * @param email
     * @param role
     * @return
     */
    public String generateAccessToken(Long id, String email, String role) {

        Claims claims = Jwts.claims().setSubject(email);
        claims.put("id", id);
        claims.put("role", role);

        Date now = new Date();
        return
                Jwts.builder()
                        // Payload를 구성하는 속성들을 정의한다.
                        .setClaims(claims)
                        // 발행일자를 넣는다.
                        .setIssuedAt(now)
                        // 토큰의 만료일시를 설정한다.
                        .setExpiration(new Date(now.getTime() + accessExpirationTime))
                        // 지정된 서명 알고리즘과 비밀 키를 사용하여 토큰을 서명한다.
                        .signWith(SignatureAlgorithm.HS256, secretKey)
                        .compact();

    }


    /**
     * 토큰 유효성 검사
     * @param token
     * @return
     */
    public boolean verifyToken(String token) {
        try {
            log.info("토큰 유효성 검사");
            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(secretKey)// 비밀키를 설정하여 파싱한다.
                    .parseClaimsJws(token);  // 주어진 토큰을 파싱하여 Claims 객체를 얻는다.
            System.out.println(claims.getBody().getExpiration());
            System.out.println(new Date());
            // 토큰의 만료 시간과 현재 시간비교
            return claims.getBody()
                    .getExpiration()
                    .after(new Date());  // 만료 시간이 현재 시간 이후인지 확인하여 유효성 검사 결과를 반환
        } catch (Exception e) {
            log.info("토큰 유효성 검사 실패");
            return false;
        }
    }


    /**
     * 토큰에서 Email 추출
     * @param token
     * @return
     */
    public String getEmail(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }


    /**
     * 토큰에서 userId 추출
     * @param token
     * @return
     */
    public Long getId(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("id", Long.class);
    }


    /**
     * 토큰에서 ROLE(권한) 추출
     * @param token
     * @return
     */
    public String getRole(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("role", String.class);
    }


    /**
     * RefreshToken 정보를 redis에 저장
     * @param email
     * @param refreshToken
     * @param accessToken
     */
    @Transactional
    public void saveTokenInfo(String email, String refreshToken, String accessToken) {
        tokenRepository.save(new RefreshToken(email, accessToken, refreshToken));
    }


    /**
     * accessToken으로 rediis에서 refreshToken 정보 삭제
     * @param accessToken
     */
    @Transactional
    public void deleteRefreshToken(String accessToken) {
        RefreshToken token = tokenRepository.findByAccessToken(accessToken)
                .orElseThrow(IllegalArgumentException::new);

        tokenRepository.delete(token);
    }


    /**
     * accessToken 재발급
     * @param accessToken
     * @return
     */
    @Transactional
    public String republishAccessToken(String accessToken) {
        // 액세스 토큰으로 Refresh 토큰 객체를 조회
        Optional<RefreshToken> refreshToken = tokenRepository.findByAccessToken(accessToken);

        // RefreshToken이 존재하고 유효하다면 실행
        if (refreshToken.isPresent() && verifyToken(refreshToken.get().getRefreshToken())) {
            // RefreshToken 객체를 꺼내온다.
            RefreshToken resultToken = refreshToken.get();
            log.info("refreshToken: {}", resultToken);
            // UserId, Email, Role을 추출해 새로운 액세스토큰을 만든다.
            Long userId = getId(resultToken.getAccessToken());
            String newAccessToken = generateAccessToken(userId, resultToken.getId(), getRole(resultToken.getRefreshToken()));
            // 액세스 토큰의 값을 수정해준다.
            resultToken.updateAccessToken(newAccessToken);
            tokenRepository.save(resultToken);
            // 새로운 액세스 토큰을 반환해준다.
            return newAccessToken;
        } else {
            throw new JwtException("accessToken 재발급 실패 - 유효하지 않은 토큰, 재로그인 필요");
        }
    }
}
