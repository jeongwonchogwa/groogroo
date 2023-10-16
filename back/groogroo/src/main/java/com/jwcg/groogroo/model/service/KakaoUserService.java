package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.user.KakaoTokenResponse;
import com.jwcg.groogroo.model.dto.user.UserInfo;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserRole;
import com.jwcg.groogroo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoUserService {

    @Autowired
    UserRepository userRepository;

    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String CLIENT_ID;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String CLIENT_SECRET;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private  String REDIRECT_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String TOKEN_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String USER_INFO_URI;


    /**
     * 카카오로 부터 토큰을 받는 함수
     */
    public void getToken(String code){
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();

        body.add("grant_type","authorization_code");
        body.add("client_id", CLIENT_ID);
        body.add("redirect_uri",REDIRECT_URI);
        body.add("client_secret", CLIENT_SECRET);
        body.add("code",code);

        KakaoTokenResponse kakaoTokenResponse = restTemplate.postForObject(
                TOKEN_URI,
                new HttpEntity<>(body,headers),
                KakaoTokenResponse.class);

        System.out.println(kakaoTokenResponse);
    }


    /**
     * 사용자 정보 가져오기
     */
    protected void getUserInfo(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        headers.add("Authorization", "Bearer "+token);

        ResponseEntity<String> response =
                restTemplate.exchange(USER_INFO_URI,
                        HttpMethod.GET,
                        new HttpEntity<>(null, headers),
                        String.class);

        String body = response.getBody();
        System.out.println(body);
    }

    /**
     * DB 확인 후 기존 회원이 아니면 DB에 저장
     */
    @Transactional
    public User saveUser(UserInfo userInfo) {

        User user = userRepository.findByEmail(userInfo.getEmail());

        //기존 회원이 아니면 DB에 저장
        if(user ==null) {
            user = User.builder()
                    .email(userInfo.getEmail())
                    .cancel(false)
                    .userRole(UserRole.USER)
                    .createTime(LocalDateTime.now())
                    .provider(userInfo.getProvider())
                    .build();

            userRepository.save(user);
        }

        return user;
    }

}
