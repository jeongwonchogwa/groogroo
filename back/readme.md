## Back-End

- 23.10.12 KJW
  - 최초 프로젝트 생성
  - application.properties 설정, 의존성 추가, 프로젝트 구조 정립

- 23.10.13 CKH
  - 모든 엔티티 생성
  - 양방향 매핑 진행

- 23.10.16 CKH
  - 나무, 열매, 꽃의 x, y 좌표 추가
  - 현재 정수형인 상태(변경 가능성 있음)
  - JWT 관련 레포지토리, 서비스, 필터 추가 -> 프로젝트에 맞게 수정 필요
  - 트리 레포지토리, 서비스, 컨트롤러 추가
  - BE 로그, response 형식 등 컨벤션 정의
  - 메인 나무 및 열매 조회 API 구현
  - 메인 나무 이미지 변경 API 구현
  - 메인 나무 생성 API 구현

- 23.10.16 KJW
  - SecurityConfig 추가
  - RestTemplateConfig 추가
  - user name 삭제, provider, createTime 추가
  - 카카로 로그인 api 구현
	  - code로 token 받아오기
	  - token으로 유저 정보 받아오기
	  - DB에 없는 이메일이면 회원가입
  - jwt 토큰 발급 및 redis에 refreshToken 저장하는 부분 추가로 구현해야함
  - KakaoUserService 생성

- 23.10.17 CKH
  - user_flower table 삭제
  - flower, fruit에 writer_nickname 추가
  - 매핑관계 조정
  - 나무 이름 중복 확인 API 추가 
  - 나의 메인 나무 조회 API 변경(열매 개수 포함), 컨트롤러 DTO생성 과정 서비스 로직으로 이관 
  - 나무 검색 API 추가(자신이 작성한 열매 데이터만 포함, 총 개수 포함)

- 23.10.17 KJW
  - OAuth2 무작정 따라하기
  
- 23.10.18 CKH
  - 열매 생성 API 추가
  - 열매 삭제 API 추가
  - 열매, 나무 프리셋 조회 API 추가
  - 열매 상세 조회 API 추가
  - 정원 생성 API 추가
  - 정원 생성 시 난수를 통해 URL 생성후 저장
  - 난수는 중복되지 않게 설정 -> 사용자가 많은 상황이라면 난수 길이를 늘리거나 Open Address 나 Chaining을 적용해야 할수도 있음
  - 정원 생성 시 UserGarden, TreeGarden에 생성자의 정보를 포함시킴

- 23.10.18 KJW
  - 카카로 로그인 API, Service 삭제
  - RestTemplateConfig 삭제, gradle에서 webClient 삭제(카카오 로그인 API 구현시 사용했던 것)
  - OAuth2을 활용한 소셜 로그인 구현
  - JWT 적용
  - RedisConfig, RedisTemplate 추가
  - 토큰 정보 Redis에 저장
  - 로그아웃 API
  - 토큰 재발급 API
  - SecurityConfig 수정

- 23.10.19 KJW
  - RedisConfig에 TTL 만료 시 보조 인덱스도 삭제되도록 설정 추가
  - 사용하지 않는 RefreshToken.java 파일 삭제
  - AccessTokenService와 RefresTokenService를 JwtUtil에 통합
  - JwtUtil에 토큰 만료 시간 application.properties에서 받아오도록 수정
  - Header에 있는 accessToken 유효성 검증 실패하는 오류 해결
    - JwtAuthFilter 수정
    - 컨트롤러 @RequestHeader("Authorization")로 수정
  - SwaggerConfig에 Swagger에서도 JWT 사용할 수 있도록 설정 추가