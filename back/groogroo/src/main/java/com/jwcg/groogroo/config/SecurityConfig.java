package com.jwcg.groogroo.config;

import com.jwcg.groogroo.config.oauth.CustomOAuth2UserService;
import com.jwcg.groogroo.config.oauth.handler.CustomAuthenticationFailureHandler;
import com.jwcg.groogroo.config.oauth.handler.CustomAuthenticationSuccessHandler;
import com.jwcg.groogroo.filter.JwtAuthFilter;
import com.jwcg.groogroo.filter.JwtExceptionFilter;
import com.jwcg.groogroo.model.entity.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtExceptionFilter jwtExceptionFilter;
    private final CustomAuthenticationSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomAuthenticationFailureHandler oAuth2LoginFailureHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Rest API & JWT 사용을 위한 설정
        http.cors(cors->cors.disable())// CORS 비활성화
                .csrf(csrf->csrf.disable())// CSRF 보호 기능 비활성화
                .httpBasic(httpBasic->httpBasic.disable())// HTTP 기본 인증을 비활성화
                .formLogin(formLogin->formLogin.disable())
                .rememberMe(rememberMe->rememberMe.disable())
                .sessionManagement(sessionManagement ->
                        sessionManagement
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        //요청에 대한 권한 설정
        http.authorizeRequests()
                //접속 허용할 url
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/login", "/flower/**", "/fruit/**", "/garden/**", "/tree/**").permitAll()
                // /admin은 관리자만 접속 가능
                .requestMatchers("/admin","/admin/**").hasRole(UserRole.ADMIN.toString())
                //나머지 요청은 인증 필요
                .anyRequest().authenticated();

        //oauth2Login 설정
        http.oauth2Login(oauth2 -> oauth2
//                        .authorizationEndpoint(authorization -> authorization
//                                        .baseUri("/oauth2/authorize")  // 소셜 로그인 url
//                                .authorizationRequestRepository(cookieAuthorizationRequestRepository)  // 인증 요청을 cookie에 저장
//                        )
//                        .redirectionEndpoint(redirection -> redirection
//                                .baseUri("/oauth2/code/*")  // 소셜 인증 후 redirect url
//                        )
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)  // 회원 정보 처리
                        )
                        .successHandler(oAuth2LoginSuccessHandler)
                        .failureHandler(oAuth2LoginFailureHandler)
        );

        // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가한다.
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtExceptionFilter, JwtAuthFilter.class);

        return http.build();
    }

}
