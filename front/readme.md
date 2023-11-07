## Front-End

- 23.10.16 JJW

  - 최초 프로젝트 생성
  - Node.js 버전 업데이트
  - Next.js
  - TypeScript
  - Zustand
  - React Query
  - TailwindCSS

- 23.10.17 KHN

  - next.js LocalFont 추가
  - TailwindCSS 폰트 추가

- 23.10.20 KHN

  - next.js LocalFont에 NeoDunggeunmo Pro 폰트 추가
  - TailwindCSS에 NeoDunggeunmo Pro 폰트 추가

- 23.10.24 KHN

  - next.js에 NES.css implement
  - TailwindCss에 색상 추가
  - textButton 구현

- 23.10.26 KHN

  - 카카오톡 공유하기 구현, 링크 복사하기 구현
    - 링크 수정 필요
    - garden 동적 라우팅, 백에서 링크 난수 받아와서 적용해야함
  - IconButton 구현
    - asset 경로 변경

- 23.10.26 MYH

  - 인풋컴포 기능 구현
    - 버튼컴포 추가 필요

- 23.10.27 JJW

  - Phaser.js 활용 정원 구현
  - 정원 내 나무 sprite 추가
  - 나무 기준으로 카메라 추적 구현

- 23.10.27 MYH

  - 모달 컴포 기능 구현
    - 콘텐트, 버튼컴포 추가 필요
  - 약관 페이지 구현

- 23.10.30 MYH

  - 약관 페이지 수정
    - 폰트 크기 수정
    - 배경, 이미지 url주소 수정
  - 시작 페이지 구현
    - 소셜로그인 방식 구현 필요
  - 나무생성 페이지 구현
    - 달리 사용방식 정한 뒤, 관련 코드 작성 필요

- 23.10.31 KJW

  - 에셋 추가
    - arrow, bell, kakao, link, plus, siren, swipe, trash, tree 버튼 에셋 추가
    - first, second, third 트로피 에셋 추가
    - 기존에 있던 png 파일 삭제

- 23.10.31 JJW

  - 정원 에셋 배치 로직 추가
  - 터치 화면 이동 로직 추가

- 23.10.31 KJW

  - 꽃, 나무 에셋 추가
  - 기존에 있던 나무 png 파일 svg로 대체

- 23.11.01 MYH

  - 나무 프리셋 페이지 구현
    - 나무 이미지 몇 개인지 세어주는 함수 고민 필요
  - 나무생성관련 페이지들 요소 크기,배치 수정

- 23.11.02 MYH

  - 프로필생성페이지 구현
    - 프리셋에서 이미지 정보 따오는건 완료
    - 달리에서 이미지 정보 따오는 코드 짜야함
  - 페이지 라우팅 추가

- 23.11.02 JJW

  - 정원 버튼 DOM요소로 교체
  - 메뉴 박스 추가

- 23.11.03 MYH

  - 정원 내 열매, 꽃 생성폼 추가
    - writer, content 정보 들어오는 것 까지 확인 완료
    - 둘중에 하나라도없으면 눌러도 정보 안가게 해놓음 근데 아예 isactive false를 할까 고민중

- 23.11.03 KJW

  - 꽃, 나무 에셋 추가
  - 꽃 에셋 폴더 이동
    - assets>>images폴더 안에 있었는데 그냥 assets 폴더 내부로 이동

- 23.11.03 JJW
  - 정원 메인 씬, 수정 씬 씬 교체 기능 구현 완료
  - 배치된 에셋 카메라 추적 구현 완료
  - 알림창 추가
  - 수정 씬 배치 에셋 틀 배경 변경 로직 추가

- 23.11.07 KJW
  - 신고 목록 API 연결
  - 추방 API 연결
  - 신고 대상 삭제 API 연결
  - pageNumber 0, completed null로 고정해놓고 신고 목록 조회 API 요청 하고 있음
    - 드롭다운에서 선택한 completed와 페이지네이션에서 선택한 pageNumber 반영되도록 수정 필요 