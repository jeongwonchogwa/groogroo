package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.entity.RefreshToken;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@PropertySource("classpath:jwt.yml")
@Slf4j
@RequiredArgsConstructor
public class JwtService {

    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;

    @Value("${access-token-secret-key}")
    private String accessTokenSecretKey;

    @Value("${refresh-token-secret-key}")
    private String refreshTokenSecretKey;

    @Value("${access-token-expiration-hours}")
    private long accessTokenExpirationHours;

    @Value("${refresh-token-expiration-hours}")
    private long refreshTokenExpirationHours;

    @Value("${issuer}")
    private String issuer;

    private final long hour = 60 * 60 * 1000;
    public String extractUserEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return Long.valueOf(extractClaim(token, claims -> claims.get("userId").toString()));
    }

    public String extractUserName(String token) {
        return extractClaim(token, claims -> claims.get("username", String.class));
    }

    public boolean isTokenValid(String token, UserDetails userDetails){
        final String userEmail = extractUserEmail(token);
        return (userEmail.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String generateToken(UserDetails userDetails){
        return generateToken(new HashMap<>(), userDetails, accessTokenSecretKey, accessTokenExpirationHours);
    }

    public String generateRefreshToken(User userDetails) {
        String refreshToken = generateToken(new HashMap<>(), (UserDetails) userDetails, refreshTokenSecretKey, refreshTokenExpirationHours);
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setUser_id(userDetails.getId());
        refreshTokenService.save(refreshTokenEntity);
        return refreshToken;
    }

//    public String refreshToken(String expiredToken, String refreshToken) {
//        UserDetails userDetails = loadUserByRefreshToken(refreshToken);  // DB에서 UserDetails 가져오기
//        return generateToken(userDetails);  // 새 Access Token 발급
//    }
//
//    private UserDetails loadUserByRefreshToken(String refreshToken) {
//        RefreshToken storedRefreshToken = refreshTokenService.findByToken(refreshToken);
//        if (storedRefreshToken != null) {
//            User user = userRepository.findUserById(storedRefreshToken.getUser_id());
//            log.info(user.getUsername());
//            return user;
//        } else {
//            throw new RuntimeException("Refresh token does not exist");
//        }
//    }

    private String generateToken
            (Map<String, Object> extraClaims, UserDetails userDetails,
             String secretKey, long expirationHours) {
        User user = (User) userDetails;
        extraClaims.put("userId", user.getId());
//        extraClaims.put("username", user.getName());

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationHours * hour))
                .signWith(getSignInKey(secretKey), SignatureAlgorithm.HS256)
                .compact();
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        log.info("secretKey : " + accessTokenSecretKey);
        return Jwts
                .parserBuilder()
                .setSigningKey(accessTokenSecretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey(String secretKey) {
        log.info(secretKey);
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
