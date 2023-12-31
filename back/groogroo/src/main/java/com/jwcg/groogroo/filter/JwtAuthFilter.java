package com.jwcg.groogroo.filter;


import com.jwcg.groogroo.model.dto.user.SecurityUserDto;
import com.jwcg.groogroo.model.entity.User;
import com.jwcg.groogroo.repository.UserRepository;
import com.jwcg.groogroo.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;


//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        // request Header에서 AccessToken을 가져온다.
//        String accessToken = request.getHeader("Authorization");
//
//        System.out.println("accessToken: "+accessToken);
//        // 토큰 검사 생략(모두 허용 URL의 경우 토큰 검사 통과)
//        if (!StringUtils.hasText(accessToken)) {
//            doFilter(request, response, filterChain);
//            return;
//        }
//
//        // AccessToken을 검증하고, 만료되었을경우 예외를 발생시킨다.
//        if (!jwtUtil.verifyToken(accessToken)) {
//            log.info("토큰: {}", accessToken);
//            throw new JwtException("Access Token 만료!");
//        }
//
//        // AccessToken의 값이 있고, 유효한 경우에 진행한다.
//        if (jwtUtil.verifyToken(accessToken)) {
//
//            // AccessToken 내부의 payload에 있는 email로 user를 조회한다. 없다면 예외를 발생시킨다 -> 정상 케이스가 아님
//            User findUser = userRepository.findByEmail(jwtUtil.getEmail(accessToken));
//            if(findUser == null) throw new IllegalStateException();
//
//            // SecurityContext에 등록할 User 객체를 만들어준다.
//            SecurityUser userDto = SecurityUser.builder()
//                    .id(findUser.getId())
//                    .email(findUser.getEmail())
//                    .role("ROLE_".concat(findUser.getUserRole().toString()))
//                    .build();
//
//            // SecurityContext에 인증 객체를 등록해준다.
//            Authentication auth = getAuthentication(userDto);
//            SecurityContextHolder.getContext().setAuthentication(auth);
//        }
//
//        filterChain.doFilter(request, response);
//    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = parseJwt(request);

        // 토큰 검사 생략(모두 허용 URL의 경우 토큰 검사 통과)
        if (token==null) {
            doFilter(request, response, filterChain);
            return;
        }

        // AccessToken을 검증하고, 만료되었을경우 예외를 발생시킨다.
        if (!jwtUtil.verifyToken(token, "access")) {
            if(request.getRequestURI().equals("/api/user/refresh")){
                // 토큰 재발급 요청인 경우 새로운 AccessToken을 응답으로 반환
                log.info("accessToken 재발급 요청");
                String newAccessToken = jwtUtil.republishAccessToken(token);
                response.setHeader("Access-Control-Expose-Headers", "Authorization");
                response.setHeader("Authorization", "Bearer " + newAccessToken);

                return;
            } else{
                throw new JwtException("Access Token 만료");
            }
        } else {
            // AccessToken 내부의 payload에 있는 userId로 user를 조회한다. 없다면 예외를 발생시킨다 -> 정상 케이스가 아님
            User findUser = userRepository.findUserById(jwtUtil.getId(token));
            if(findUser == null) throw new IllegalStateException();

            // SecurityContext에 등록할 User 객체를 만들어준다.
            SecurityUserDto userDto = SecurityUserDto.builder()
                    .id(findUser.getId())
                    .email(findUser.getEmail())
                    .role("ROLE_".concat(findUser.getUserRole().toString()))
                    .build();

            // SecurityContext에 인증 객체를 등록해준다.
            Authentication auth = getAuthentication(userDto);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7, headerAuth.length());
        }
        return null;
    }


    public Authentication getAuthentication(SecurityUserDto user) {
        return new UsernamePasswordAuthenticationToken(user, "",
                List.of(new SimpleGrantedAuthority(user.getRole())));
    }

}