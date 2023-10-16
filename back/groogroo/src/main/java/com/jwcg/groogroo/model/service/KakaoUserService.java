package com.jwcg.groogroo.model.service;

import com.jwcg.groogroo.model.dto.user.KakaoTokenResponse;
import com.jwcg.groogroo.model.dto.user.UserInfo;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserRole;
import com.jwcg.groogroo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
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

    private final UserRepository userRepository;

    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String CLIENT_ID;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private  String REDIRECT_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
    private String TOKEN_URI;

    @Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
    private String USER_INFO_URI;


    /**
     * 카카오로 부터 토큰을 받는 함수
     */
    public User getToken(String code){
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();

        body.add("grant_type","authorization_code");
        body.add("client_id", CLIENT_ID);
        body.add("redirect_uri",REDIRECT_URI);
        body.add("code",code);

        KakaoTokenResponse kakaoTokenResponse = restTemplate.postForObject(
                TOKEN_URI,
                new HttpEntity<>(body,headers),
                KakaoTokenResponse.class);

        log.info("토큰 - {}",kakaoTokenResponse);
        String email = getUserInfo(kakaoTokenResponse.getAccess_token());

        return saveUser(email);
    }


    /**
     * 사용자 정보 가져오기
     */
    protected String getUserInfo(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        headers.add("Authorization", "Bearer "+token);

        ResponseEntity<String> response =
                restTemplate.exchange(USER_INFO_URI,
                        HttpMethod.GET,
                        new HttpEntity<>(null, headers),
                        String.class);

        String responseBody = response.getBody();

        // JSON 파싱을 통해 이메일 추출
        JSONObject json = new JSONObject(responseBody);
        String email = json.getJSONObject("kakao_account").getString("email");
        log.info("이메일 - {}",email);
        return email;
    }

    /**
     * DB 확인 후 기존 회원이 아니면 DB에 저장
     */
    @Transactional
    public User saveUser(String email) {

        User user = userRepository.findByEmail(email);

        //기존 회원이 아니면 DB에 저장
        if(user ==null) {
            log.info("기존 회원 아님");
            user = User.builder()
                    .email(email)
                    .cancel(false)
                    .userRole(UserRole.USER)
                    .createTime(LocalDateTime.now())
                    .provider("kakao")
                    .build();

            userRepository.save(user);
            log.info("회원가입 완료");
        }

        return user;
    }

}
