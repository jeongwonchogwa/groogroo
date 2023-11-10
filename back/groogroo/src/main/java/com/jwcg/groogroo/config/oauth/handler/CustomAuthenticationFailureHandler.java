package com.jwcg.groogroo.config.oauth.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import org.springframework.security.core.AuthenticationException;
import java.io.IOException;

@Component
@Slf4j
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler  {
    @Value("${client_url}")
    String client_url;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        // 인증 실패시 메인 페이지로 이동
        response.sendRedirect(client_url);
    }
}