# 🎫 SeatSync – Frontend

> 공연 좌석 선점 및 예약 기능을 제공하는 공연 예약 웹 서비스

Redis 기반 좌석 선점 동시성 제어와 QueryDSL 복합 필터 검색을 핵심으로 하는 공연 예약 서비스입니다.
AI와의 바이브 코딩(Vibe Coding) 방식으로 설계부터 AWS 배포까지 하루 만에 완성한 개인 프로젝트입니다.

🔗 [Backend 레포](https://github.com/toma9512/seatsync-backend)　|　🔗 [배포 주소](http://43.201.76.129)

---

## 📌 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 개발 기간 | 2026.04.23 (1일) |
| 개발 방식 | AI와의 바이브 코딩 (Vibe Coding) |
| 인원 | 1인 개인 프로젝트 |
| 본인 역할 | 프론트엔드 전담 설계 · 구현 · 배포 |

---

## 🛠 Tech Stack

| 구분 | 기술 |
| --- | --- |
| Framework | React 18 |
| 서버 상태 관리 | React Query |
| 전역 상태 관리 | Zustand |
| HTTP 통신 | Axios |
| 빌드 도구 | Vite |
| Infra | AWS EC2 · Nginx · GitHub Actions |

---

## ✨ 주요 기능

### 🔐 회원 인증
- 회원가입 · 로그인 · 로그아웃
- JWT 토큰 localStorage 저장 및 Axios 인터셉터 자동 주입
- 401 응답 시 토큰 제거 및 로그인 페이지 자동 리다이렉트
- PrivateRoute로 비인증 사용자 접근 차단

### 🎭 공연 목록 · 검색
- React Query로 공연 목록 데이터 캐싱 및 관리
- 장르 선택 · 키워드 입력 복합 필터 검색
- 검색 실행 시 queryKey 변경으로 자동 재조회
- 공연 카드 클릭 시 상세 페이지 이동

### 🎟 좌석 선점
- 회차 선택 시 해당 회차 좌석 목록 조회
- 좌석 상태(AVAILABLE · PENDING · RESERVED)별 색상 구분 표시
- AVAILABLE 좌석만 클릭 가능, 선점 요청 후 예약 확정 페이지로 이동

### ⏱ 예약 확정 (타이머)
- 페이지 진입 시 백엔드에서 Redis TTL 잔여 시간 조회
- 실제 남은 시간으로 카운트다운 시작 (페이지 재진입 시 리셋 방지)
- 60초 이하 시 타이머 빨간색 + 깜빡임 애니메이션
- TTL 만료 시 자동으로 메인 페이지 이동

### 📋 내 예약 목록
- React Query + useMutation으로 예약 취소 후 목록 자동 갱신
- PENDING(선점 중) 상태에서 예약 확정 페이지로 바로 이동 가능
- CONFIRMED · PENDING · CANCELLED 상태별 색상 구분

---

## 🔑 기술적 의사결정

### 1. 서버 상태 · 전역 상태 분리 — React Query + Zustand

| 구분 | 도구 | 이유 |
| --- | --- | --- |
| 서버 상태 (API 응답) | React Query | 캐싱 · 자동 갱신 · 로딩/에러 처리를 선언적으로 관리 |
| 전역 UI 상태 | Zustand | 로그인 상태 · 토큰 등 서버와 무관한 클라이언트 상태를 단순하게 관리 |

두 상태를 하나의 저장소에 혼용하면 서버 응답 시점과 UI 상태가 꼬이는 문제가 발생합니다.
React Query와 Zustand를 역할에 따라 분리해 **API 호출 흐름과 UI 상태의 일관성**을 유지했습니다.

---

### 2. Redis TTL 잔여 시간 조회 — 페이지 재진입 시 타이머 리셋 방지

페이지 진입 시마다 5분으로 타이머를 초기화하면 실제 선점 만료 시간과 달라지는 문제가 발생합니다.
백엔드에서 `redisTemplate.getExpire()`로 실제 TTL 잔여 시간을 조회해 프론트에 전달하고,
해당 값으로 타이머를 시작해 **항상 실제 만료 시간과 동기화**되도록 설계했습니다.

---

## 🔍 트러블슈팅

### 1. Vite 개발 환경에서 API 요청이 백엔드로 전달되지 않는 문제

**문제** : `axios.get('/api/events')` 요청이 백엔드(8080)가 아닌 프론트(5173)로 전달되어 HTML 응답 반환

**원인** : Vite 개발 서버에서 `/api` 경로를 별도 처리하지 않아 React Router가 가로챔

**해결** : `vite.config.js`에 프록시 설정 추가

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

**배운 점** : 개발 환경과 배포 환경의 API 요청 경로 처리 방식이 다르므로
환경변수(`VITE_API_URL`)로 baseURL을 분리해 관리해야 함

---

### 2. Git 파일명 대소문자 변경이 반영되지 않는 문제

**문제** : `NavBar.jsx` → `Navbar.jsx`로 변경했으나 GitHub에 반영되지 않아 CI 빌드 실패

**원인** : macOS 파일 시스템이 대소문자를 구분하지 않아 Git이 변경으로 인식하지 못함

**해결** : `git mv` 명령어로 강제 변경

```bash
git mv src/components/common/NavBar.jsx src/components/common/Navbar.jsx
```

**배운 점** : macOS 환경에서 파일명 대소문자 변경 시 반드시 `git mv` 사용 필요

---

## 🔗 링크

| 구분 | 링크 |
| --- | --- |
| 배포 (서비스) | http://43.201.76.129 |
| Backend 레포 | https://github.com/toma9512/seatsync-backend |
| Frontend 레포 | https://github.com/toma9512/seatsync-frontend |
| Notion | https://well-group-b12.notion.site/31f560d3713f8098b275d7074c98686e |
