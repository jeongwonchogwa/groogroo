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

- 23.10.19 CKH
  - 나무, 열매 API 테스트 진행 및 버그 수정
  - findTreeByNameLike의 파라미터에 와일드카드(%) 추가

- 23.10.20 KJW
  - S3Config 추가
  - S3UploadService 추가
  - 테스트용 S3 Controller 추가
  - 회원 탈퇴 API 구현
  - User의 boolean cancel을 int status로 변경해서 탈퇴 유저와 차단 유저 구분할 수 있게 변경 (0:일반 회원, 1:탈퇴, 2:차단)

- 23.10.20 KHN
  - 꽃 API 생성, 조회, 삭제 추가
  - 꽃 삭제 시 관리자 및 작성자 입력 5분 내에만 삭제 가능하도록 변경 필요

- 23.10.23 KJW
  - 신고하기 API 구현
  - 내 신고내역 조회 API 구현
  - CustomAuthenticationSuccessHandler에 로그인 성공 시 프론트로 redirect하는 부분 추가
    - redirect uri 추후 변경 필요

- 23.10.23 CKH
  - 정원 생성 API 구현
    - 정원 생성 시, 생성자는 관리자로 가입되고 자신의 나무의 정원 상 위치 정보 필요
  - 엔티티의 @Data 어노테이션 @Getter, @Setter로 변경 -> 해시코드 무한루프 이슈(트러블 슈팅 참조)
  - 일대일 매핑간 레이지 로딩 적용
  - 정원 조회 API 구현
    - 정원의 이름, 설명과 정원에 속한 꽃, 나무의 위치 정보들을 조회한다.
  - 소속 정원 목록 조회 API 구현
    - 소속 정원의 목록 & 가입 승인 대기중인 정원의 목록 리턴
    - 추후 순서 정렬, 알림으로 거절, 추방, 승인 안내 예정
  - 정원 마스터 권한 지정 API 구현
    - 타겟을 마스터로 지정할 시, 본인은 멤버로, 타겟은 마스터로 갱신
    - 타겟을 관리자로 지정할 시, 타겟을 관리자로 갱신
    - 타겟을 멤버로 지정할 시, 타겟을 멤버로 갱신
  - 정원 초대 링크 조회 API 구현
    - 링크는 랜덤의 영어 대, 소문자, 숫자로 구성되어 있음

- 23.10.23 KHN
  - Flower API 구현
  - Flower 삭제 시 5분 이내 및 관리자만 가능
    - 5분 초과시 일반 유저의 경우, 403에러 발생
  - Flower 생성 시 x, y 좌표 같이 받아서 처리

- 23.10.24 CKH
  - 나무 이미지 저장 API 구현
    - s3 서버에 이미지가 저장되고 URL을 리턴함
  - 나무 프리셋 = groogroo가 기본적으로 제공하는 프리셋 + 유저가 제작한 프리셋 + 마음에 들어서 추가한 다른 유저의 프리셋
  - 나무 프리셋 조회, 추가, 삭제 API 구현
  
- 23.10.24 KJW
  - report에 completed(처리 완료 여부) 추가
  - user에 status int에서 enum으로 변경
  - Admin API는 UserRole이 ADMIN인 경우에만 접속 가능하도록 설정
  - 신고 접수 내역 조회 API 구현
  - 회원 차단 API 구현
  - 회원 조회 API 구현
  - flower, fruit, garden, userGarden, treeGarden 에 deleteDate(삭제 날짜) 추가
    - 삭제일로 부터 며칠 지나면 DB에서 완전 삭제되게 해야함
    - 해당 entity 조회할 때 deleteDate = null 조건 추가해야함
  - 정원에서 추방시키는 API 구현
  - 신고 대상 삭제하는 API 구현
    - 꽃, 열매 삭제는 기존 service에 있던 것 사용해서 delete됨 수정 필요
    - 삭제하면 같은 대상에 대한 신고내역 모두 처리 완료로 변경
  - 정원 가입 신청 API 구현

- 23.10.25 CKH
  - 유저가 가입한 정원 목록에 페이지네이션 적용
  - 좋아요 관련 기능 구현
    - 좋아요, 좋아요 취소, 좋아요 여부 조회, 좋아요 개수 조회, 좋아요 한 정원 목록 조회, 좋아요 랭킹 목록 조회 API 구현
    - TO DO: 현 상황은 Redis 가 메인 DB인 상태... MySQL로 플러시 스케쥴러? 아무튼 공부를 더 해서 MySQL에 TTL이 만료될 때 플러시하도록 추가해야한다.
  - 정원 엔티티에 속성 추가
    - memberCnt -> 현인원
    - capacity -> 정원
  - 정원 정보 조회 서비스 로직에 추가된 속성 및 좋아요 정보 포함

- 23.10.25 KJW
  - 정원 가입 처리 API 구현
    - gardenRole MEMBER면 403 반환
  - 정원 가입 결과 조회 API 구현
  - 정원 탈퇴 API 구현
    - gardenRole MASTER면 403 반환
  - BadRequestException 삭제, CustomException 추가

- 23.10.26 KJW
  - 로그인 시 userStatus가 BLOCK이면(차단된 회원이면) 로그인 막음
  - 정원, 꽃, 열매, 나무 조회할 때 deleteDate is null 조건 넣어줌
  - 정원 인원 수 적용
    - 정원 가입 할 때 인원 다 찬 정원이면 예외 던짐
    - 정원 가입 승인하면 인원수 +1 / 정원 탈퇴하거나 추방당하면 인원수 -1
  - 회원 탈퇴할 때 MASTER인 정원 있는지 확인해서 있으면 탈퇴  못하게 함