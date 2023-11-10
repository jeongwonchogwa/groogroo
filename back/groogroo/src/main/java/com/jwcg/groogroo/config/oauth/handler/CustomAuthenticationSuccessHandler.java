package com.jwcg.groogroo.config.oauth.handler;

import com.jwcg.groogroo.model.dto.jwt.GeneratedToken;
import com.jwcg.groogroo.model.entity.UserStatus;
import com.jwcg.groogroo.util.JwtUtil;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.model.entity.UserRole;
import com.jwcg.groogroo.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${client_url}")
    String client_url;

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // OAuth2User로 캐스팅하여 인증된 사용자 정보를 가져온다.
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        // 사용자 이메일을 가져온다.
        String email = oAuth2User.getAttribute("email");
        // 서비스 제공 플랫폼(GOOGLE, KAKAO, NAVER)이 어디인지 가져온다.
        String provider = oAuth2User.getAttribute("provider");

        // CustomOAuth2UserService에서 셋팅한 로그인한 회원 존재 여부를 가져온다.
        boolean isExist = oAuth2User.getAttribute("exist");

        // 회원이 존재하지 않을 경우 DB에 저장
        if(!isExist){
                User user = User.builder()
                    .email(email)
                    .userStatus(UserStatus.USER)
                    .userRole(UserRole.USER)
                    .createTime(LocalDateTime.now())
                    .provider(provider)
                    .build();
            userRepository.save(user);
        }

        User user = userRepository.findByEmail(email);
        long treeId = user.getTree().getId();
        log.info("role: {}", user.getUserRole().toString());
        // accessToken과 refreshToken을 발행한다.
        GeneratedToken token = jwtUtil.generateToken(user.getId(), email, user.getUserRole().toString(),treeId==null? null:treeId);
        log.info("AccessToken: {}", token.getAccessToken());
        log.info("RefreshToken: {}", token.getRefreshToken());
        String uri = UriComponentsBuilder.fromUriString(client_url+"/redirect")
                .queryParam("accesstoken", token.getAccessToken())
                .build().toUriString();
        response.sendRedirect(uri);
    }

}