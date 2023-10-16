package com.jwcg.groogroo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors->cors.disable()).csrf(csrf->csrf.disable())
                .authorizeRequests()
                //접속 허용할 url
                .requestMatchers("/**","/user/signup", "/user/login", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                //나머지 요청은 인증 필요
                .anyRequest().authenticated();
        return http.build();
    }

}
