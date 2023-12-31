## Flask 실행하기  
: `flask/` 폴더 경로에서 시작한다

### 가상환경 설치
`python -m venv venv`

### 가상환경 활성화
`source venv/Scripts/activate`  
- 참고(가상환경 비활성화):  
  `deactivate`

### 필요한 라이브러리 설치
`pip install -r requirements.txt`

#### 설치된 라이브러리 관리
`pip freeze > requirements.txt`

### `.env` 파일 추가
```
# OpenAI_API_KEY
OPENAI_API_KEY=[API_KEY]

# Naver search & Papago API
NAVER_API_CLIENT_ID=[ID]
NAVER_API_CLIENT_SECRET=[SECRET_KEY]
```

### 서버 실행
`python app.py` or `flask run`


## 참고 링크

- [블로그 - google](https://www.dinolabs.ai/386)
  - [googletrans 라이브러리](https://pypi.org/project/googletrans/)
  - [google cloud - Translation AI](https://cloud.google.com/translate/?hl=ko)

- [블로그 - naver & kakao](https://www.dinolabs.ai/387)

- [라이브러리 - rembg](https://pypi.org/project/rembg/)