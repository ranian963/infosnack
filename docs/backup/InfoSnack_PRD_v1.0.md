# InfoSnack (인포스낵) PRD

> **Product Requirements Document**
> 버전: 1.0 | 작성일: 2025년 1월 | 대상 팀: AI Agent 팀 (5~6명)

---

## 0. 서비스 브랜딩

### 0.1 서비스명

| 구분 | 이름 |
|------|------|
| 영문 | InfoSnack |
| 한글 | 인포스낵 |

### 0.2 슬로건

- "정보를 간편하게, 한 입 크기로"
- "Snack your information"

### 0.3 BI 콘셉트

**한글 로고**
- "인"의 ㅇ 위치에 깨진 과자 이미지 배치
- 둥근 폰트로 친근하고 가벼운 느낌 표현

**영문 로고**
- 과자 봉지 형태의 패키지 디자인
- 봉지 안에 "InfoSnack" 텍스트 + 과자 일러스트
- "+" 아이콘으로 정보 추가/수집 의미 암시

### 0.4 브랜드 컬러

**Primary Color (메인 컬러)**

| 용도 | 색상 | HEX | RGB |
|------|------|-----|-----|
| Primary Blue | 🔵 스카이 블루 | #18AEF6 | RGB(24, 174, 246) |
| Primary Blue (밝은) | 🔵 | #19AFF7 | RGB(25, 175, 247) |
| Primary Blue (어두운) | 🔵 | #16AAF1 | RGB(22, 170, 241) |

**Secondary Color (보조 컬러)**

| 용도 | 색상 | HEX | RGB |
|------|------|-----|-----|
| Snack Yellow | 🟡 과자 노란색 | #FBDB5B | RGB(251, 219, 91) |
| Snack Gold | 🟡 | #F9D854 | RGB(249, 216, 84) |

**Accent Color (강조 컬러)**

| 용도 | 색상 | HEX | RGB |
|------|------|-----|-----|
| Snack Brown | 🟤 과자 테두리 | #A38F52 | RGB(163, 143, 82) |
| Brown Dark | 🟤 | #776C34 | RGB(119, 108, 52) |

**Neutral Color (중립 컬러)**

| 용도 | 색상 | HEX | RGB |
|------|------|-----|-----|
| White | ⚪ 배경 | #FFFFFF | RGB(255, 255, 255) |
| Surface | ⚪ 카드 배경 | #F5F7FA | RGB(245, 247, 250) |
| Gray | 🔘 | #9E9E9E | RGB(158, 158, 158) |
| Gray Dark | 🔘 텍스트 | #333333 | RGB(51, 51, 51) |
| Text Secondary | 🔘 보조 텍스트 | #666666 | RGB(102, 102, 102) |
| Border | 🔘 테두리 | #E0E0E0 | RGB(224, 224, 224) |

**Dark Mode Palette (다크 모드)**

| 용도 | HEX |
|------|-----|
| Background | #1A1A2E |
| Surface | #252540 |
| Card | #2D2D4A |
| Border | #3A3A5A |
| Text Primary | #FFFFFF |
| Text Secondary | #A0A0A0 |
| Primary | #18AEF6 |
| Accent | #FBDB5B |

### 0.5 컬러 활용 가이드

| 요소 | 적용 컬러 |
|------|-----------|
| 메인 버튼, 헤더 | Primary Blue (#18AEF6) |
| 호버/액티브 상태 | Primary Blue 어두운 (#16AAF1) |
| 강조 포인트, 알림 뱃지 | Snack Yellow (#FBDB5B) |
| 링크, 아이콘 | Primary Blue |
| 본문 텍스트 | Gray Dark (#333333) |
| 배경 | White (#FFFFFF) |
| 카드 배경 | Surface (#F5F7FA) |

### 0.6 로고 사용 가이드

| 용도 | 권장 버전 |
|------|-----------|
| 웹사이트 헤더 | 한글 또는 영문 (대상에 따라) |
| 앱 아이콘 | 영문 봉지 (과자만) |
| 파비콘 | 과자 이미지만 |
| 주간 다이제스트 헤더 | 한글 버전 |
| SNS 공유 썸네일 | 영문 봉지 |

---

## 1. 프로젝트 개요

### 1.1 배경 및 문제점

팀원들이 다양한 플랫폼(유튜브, 웹, X, Facebook, LinkedIn, Threads, Reddit, 뉴스레터 등)에서 유용한 정보를 발견하지만, 이를 체계적으로 관리하고 공유하는 데 어려움을 겪고 있습니다.

- 개인 메신저의 '나에게 보내기'로 링크를 저장하지만, 나중에 찾기 어려움
- 슬랙에 공유하면 대화에 묻히고, 노션에 정리하면 결국 안 보게 됨
- 정보가 파편화되어 팀 전체의 지식 공유가 이루어지지 않음
- 공유 기능이 불편하여 지속적인 정보 수집이 어려움

### 1.2 목표

- **정보 수집의 편의성 극대화**: 어떤 플랫폼에서든 쉽게 링크 저장
- **자동화된 정리 및 요약**: AI를 활용한 태깅, 요약, 썸네일 생성
- **팀 단위 지식 공유**: 주간 다이제스트를 통한 정보 공유 및 지식 축적
- **지능형 질의응답**: Graph RAG 기반 챗봇으로 축적된 지식에 대한 질의응답

### 1.3 핵심 가치 제안

> **"좋은 인풋이 좋은 아웃풋을 만든다"**

단순 정보 수집을 넘어, 팀의 집단 지성을 키우고 축적된 지식을 손쉽게 공유·검색할 수 있는 지식 관리 시스템

---

## 2. 사용자 및 팀 구조

### 2.1 초기 사용자

- AI Agent 관련 활동을 하는 팀 (5~6명)
- 개인별 계정으로 구분
- 추후 다른 팀으로 확장 가능성 고려

### 2.2 라이브러리 구조

| 단계 | 구조 |
|------|------|
| MVP | 팀 공용 라이브러리로 시작 |
| 고도화 | 개인 라이브러리와 팀 공유 라이브러리 분리 |

---

## 3. 핵심 기능 정의

### 3.1 MVP 기능

#### 3.1.1 정보 수집 (Capture)

| 수집 방식 | 설명 |
|-----------|------|
| 브라우저 확장 프로그램 | Chrome, Safari 지원 |
| 모바일 공유 시트 | iOS Share Extension, Android Share Intent |

#### 3.1.2 자동 수집 (Custom Auto-Collection)

사용자가 자주 보는 출처(블로그/RSS/뉴스레터/계정 등)를 직접 등록해두면, 정해둔 주기마다 시스템이 **새 항목만** 자동 수집한다. 기존엔 사람이 매번 링크를 넘겨야 정보가 쌓였지만, "한 번 등록해두면 알아서 쌓이는" 능동적 수집을 더한다. 수집된 콘텐츠는 별도 저장소가 아니라 **기존 처리 파이프라인(이미지 분석·OCR → AI 요약·태깅 → 썸네일 → 검색 인덱싱 → 지식 그래프)에 그대로 합류**하여, 사람이 넘긴 콘텐츠와 동일하게 보이고 검색·챗봇에 함께 잡힌다.

**수집처 추가 (계층형)**

처음 화면은 주소 입력칸 하나만 보이며, 숙련도에 따라 깊이가 나뉜다.

| 단계 | 내용 | 비고 |
|------|------|------|
| 1단계 — 붙여넣기 | 주소를 붙이면 종류 자동 감지 + 합리적 기본값 적용 (기본 추출 = 전체 본문) | 대부분 여기서 끝 |
| 2단계 — 핵심 옵션 | 본문 범위, 수집 주기, 자동 태그 조정 | 옵션 펼침 |
| 3단계 — 고급 레시피 | 가져올 영역 등 직접 지정 | P2, 고급 사용자 전용 |

> 등록 시 즉시 1회 시범 수집으로 **미리보기**를 제공하여, 저장 전에 제대로 들어오는지 확인할 수 있다.

**소스 종류 자동 감지**

- 주소를 보고 유형 판단(RSS / 계정형(X·LinkedIn·Reddit 등) / 일반 웹페이지) 후 기본값 적용
- RSS면 피드 항목을, 계정형이면 새 게시물을, 일반 페이지면 본문을 기준으로 설정
- 감지 결과를 화면에 표시하며, 사용자가 수동으로 다른 종류로 변경 가능

**추출 옵션**

| 옵션 | 설명 |
|------|------|
| 본문 범위 | 전체 본문(기본) / 요약만 / 특정 영역만(고급) |
| 링크 따라가기(depth) | 본문 내 링크까지 가져올지 여부 (기본값: 해당 항목만) |
| 자동 태그 | 이 소스로 들어오는 콘텐츠에 자동으로 붙일 태그를 미리 지정 |

**자동 수집 실행**

- 사용자가 정한 주기(매시간 / 하루 1회 / 직접 입력)마다 소스를 확인해 **새 항목만** 수집
- 마지막 확인 이후 올라온 새 글만 가져오고, 이미 수집한 항목은 건너뜀
- 과도하게 잦은 주기를 막기 위한 최소 간격 가이드를 둔다

**수집된 콘텐츠 처리**

- 별도 저장소가 아니라 기존 처리 파이프라인에 그대로 합류 (이미지 분석·OCR → AI 요약·태깅 → 썸네일 → 검색 인덱싱 → 지식 그래프)
- 자동 수집된 항목은 어떤 수집처에서 왔는지 **출처를 표시**한다

**수집처 관리**

- 등록 소스 목록 / 마지막 수집 시각 / 상태 / 최근 수집 건수 표시
- 각 소스를 일시중지·재개·편집·삭제 가능
- 사이트 구조 변경 등으로 수집 실패가 반복되면 해당 소스를 **자동 일시중지 + 알림**
- 누구나 소스를 추가하므로 중복·방치 소스가 쌓이기 쉬워, 이 관리 화면이 품질 유지의 핵심이다

**고급 레시피 (P2)**

- 까다로운 사이트를 위한 선택 경로로, 가져올 영역을 직접 지정하는 등 세밀한 규칙을 작성
- 일반 사용자는 거의 사용하지 않으며, 고급 사용자 전용 옵션이다

#### 3.1.3 크롤링 및 저장 (Process)

**지원 플랫폼**

| 플랫폼 | 크롤링 방식 | 비고 |
|--------|-------------|------|
| 공개 웹/블로그 | 직접 크롤링 | 가장 쉬움 |
| YouTube | API + 자막 추출 | 영상 요약 가능 |
| X (Twitter) | 브라우저 자동화 | 로그인 세션 활용 |
| Facebook | 브라우저 자동화 | 로그인 세션 활용 |
| LinkedIn | 브라우저 자동화 | 로그인 세션 활용 |
| Threads | 브라우저 자동화 | 로그인 세션 활용 |
| Reddit | API 또는 크롤링 | API 제공됨 |
| 이메일/뉴스레터 | 포워딩 또는 업로드 | 이메일 파싱 |

**크롤링 설정**
- 사용자가 depth 선택 가능
- 기본값: 1-depth (본문 내 직접 링크까지만 수집)

**저장 형식**
- 텍스트: Markdown 형식
- 이미지/비디오: 원본 파일 저장
- 메타데이터: OG 태그, 작성자, 작성일, 플랫폼 정보

#### 3.1.4 이미지 분석 및 OCR

본문에 포함된 이미지를 자동으로 분석하여 콘텐츠의 이해도와 검색성을 높입니다.

**처리 대상**
- 본문 내 삽입된 이미지
- 인포그래픽, 차트, 다이어그램
- 스크린샷, 코드 이미지
- 슬라이드/발표자료 이미지

**처리 내용**

| 기능 | 설명 | 활용 |
|------|------|------|
| 이미지 캡션 생성 | Vision AI로 이미지 내용 설명 | 검색, 요약에 반영 |
| OCR 텍스트 추출 | 이미지 내 텍스트 인식 | 전문 검색 가능 |
| 차트/그래프 분석 | 데이터 시각화 해석 | 인사이트 추출 |
| 코드 인식 | 코드 스크린샷 텍스트화 | 코드 검색/복사 가능 |

**저장 구조**

```
Content
├── raw_content (Markdown)
├── images[]
│   ├── url: 원본 이미지 URL
│   ├── local_path: 로컬 저장 경로
│   ├── caption: AI 생성 캡션
│   ├── ocr_text: 추출된 텍스트
│   └── analysis: 상세 분석 결과 (JSON)
```

#### 3.1.5 AI 처리

- 자동 요약 생성 (이미지 분석 결과 포함)
- 자동 태깅 (사용자 지정 태그 + AI 추천 태그)
- 대표 썸네일 이미지 자동 생성 (모든 콘텐츠)
- 주간 다이제스트용 대표 이미지 생성
- 이미지 캡션 및 OCR 텍스트 생성

#### 3.1.6 정리 및 검색 (Organize)

- Elasticsearch 기반 전문 검색 (Full-text Search)
- 이미지 OCR 텍스트도 검색 대상에 포함
- 태그 기반 필터링
- 시간 범위 필터 (작성일, 수집일)
- 읽음/안읽음 상태 관리 (개인별, 타인에게 비공개)
- 북마크(저장 표시) 기능 (개인별, 즐겨찾는 콘텐츠 모아보기)

#### 3.1.7 챗봇 질의응답

- Graph RAG 기반 지능형 챗봇
- 축적된 콘텐츠에 대한 자연어 질의응답
- 콘텐츠 간 관계를 파악한 맥락적 답변
- 이미지 내용에 대한 질의응답도 가능

**예시 질문**
- "최근 AI Agent 관련 트렌드는?"
- "LangChain과 LlamaIndex를 비교한 콘텐츠 찾아줘"
- "지난달에 저장한 RAG 관련 글들 요약해줘"
- "아키텍처 다이어그램이 포함된 글 찾아줘"

#### 3.1.8 다이제스트 (Digest)

- 일간/주간 다이제스트 자동 생성 (주간 다이제스트가 핵심)
- 트렌드 분석 및 주요 토픽 추출
- 그 주 수집된 콘텐츠 중 AI가 다이제스트 후보 콘텐츠를 추천 (중요도/트렌드 기반)
- 사용자가 추천 목록을 검토하여 콘텐츠 포함/제외, 순서 조정, 코멘트 편집 후 **확정(배포)**
- 배포 시 공개 공유 링크 자동 생성 (추측 불가능한 토큰 URL, 예: `/share/:token`), 링크 복사로 외부 공유 가능
- 공개 뷰는 로그인 없이 누구나 열람 가능 (읽기 전용)
- 다이제스트 상태: 초안(draft, AI 추천 상태) → 배포(published)

#### 3.1.9 알림

- 다이제스트 배포(published) 시 Google Chat 알림 전송
- 최소한의 알림으로 노이즈 방지

#### 3.1.10 데이터 관리

- 내보내기(Export) 기능
- 백업 정책 (이중화 고려)

### 3.2 고도화 기능

| 우선순위 | 기능 | 설명 |
|:--------:|------|------|
| 1 | 라이브러리 분리 | 개인 라이브러리와 팀 공유 라이브러리 |
| 2 | 권한 및 협업 | 역할 기반 접근 제어 |
| 3 | 하이라이트/메모 | 콘텐츠 특정 부분 형광펜 + 메모 |
| 4 | 콘텐츠 연결 | 지식 그래프 시각화 |
| 5 | 유사 콘텐츠 추천 | "이것도 관심 있을 수 있어요" 피드 |
| 6 | 인사이트 대시보드 | 태그 통계, 팀원별 기여도, 수집 패턴 |

> 자동 구독(RSS 피드·특정 계정 팔로우 등)은 **자동 수집(3.1.2)으로 MVP 핵심 기능에 승격**되었다.

---

## 4. 사용자 흐름

### 4.1 정보 수집 흐름

```
사용자가 흥미로운 콘텐츠 발견
    ↓
브라우저 확장 / 모바일 공유로 링크 전달
    ↓
서버에서 크롤링 시작 (Playwright 브라우저 자동화)
    ↓
본문 텍스트 + 이미지 추출
    ↓
이미지 분석 (Vision AI 캡션 생성 + OCR 텍스트 추출)
    ↓
AI가 요약, 태깅, 썸네일 생성 (이미지 분석 결과 포함)
    ↓
데이터베이스 + Elasticsearch 인덱싱 + 지식 그래프 저장
    ↓
사용자에게 저장 완료 알림
```

### 4.2 자동 수집 흐름

```
사용자가 수집처(블로그/RSS/계정 등) 주소 등록
    ↓
소스 종류 자동 감지 + 기본값 적용 → 미리보기 확인
    ↓
수집 주기·옵션 설정 후 저장
    ↓
백그라운드 스케줄러가 주기마다 소스 확인 (새 항목만)
    ↓
기존 처리 파이프라인 합류 (요약·태깅·검색·그래프) → 출처 표시
    ↓
라이브러리에 자동 등장 (검색·챗봇에 함께 노출)
```

### 4.3 질의응답 흐름

```
사용자가 챗봇에 질문 입력
    ↓
Graph RAG가 질문 분석
    ↓
지식 그래프에서 관련 엔티티/관계 탐색 + 벡터 검색
    ↓
관련 콘텐츠 컨텍스트 수집
    ↓
LLM이 답변 생성 (출처 포함)
    ↓
사용자에게 답변 + 관련 콘텐츠 링크 제공
```

### 4.4 다이제스트 큐레이션 및 공유 흐름

```
시스템이 주간 수집 콘텐츠 집계
    ↓
AI가 다이제스트 후보 콘텐츠 추천 (초안 생성)
    ↓
사용자가 검토·편집(포함/제외·순서·코멘트)
    ↓
다이제스트 확정(배포) → 공개 공유 링크 생성
    ↓
Google Chat 알림 + 링크 복사로 공유
    ↓
누구나 공개 링크로 다이제스트 열람(읽기 전용)
```

---

## 5. 기술 스택

### 5.1 Frontend (Next.js + pnpm)

| 영역 | 기술 | 용도 |
|------|------|------|
| Core | Next.js 14+, TypeScript, React 18 | 프레임워크, 타입 시스템 |
| Styling | Tailwind CSS, Shadcn/ui, Lucide React | UI 컴포넌트, 아이콘 |
| Animation | Framer Motion | 인터랙션, 트랜지션 |
| State | Zustand | 클라이언트 전역 상태 |
| Server State | TanStack Query | API 캐싱, 서버 상태 관리 |
| Form | React Hook Form, Zod | 폼 처리, 스키마 검증 |
| Auth | NextAuth.js v5 (Auth.js) | 인증/인가 |
| Utility | date-fns, uuid | 날짜 처리, 고유 ID |
| QA | ESLint, Prettier, Husky, lint-staged, Commitlint | 코드 품질 |
| Test | Vitest, Playwright | 단위/E2E 테스트 |

### 5.2 Backend (FastAPI + uv)

| 영역 | 기술 | 용도 |
|------|------|------|
| Core | Python 3.11+, FastAPI, Pydantic | 프레임워크, 검증 |
| DB | SQLAlchemy 2.0, asyncpg, Alembic | ORM, 비동기 DB, 마이그레이션 |
| Search | Elasticsearch | 전문 검색, 로그 분석 |
| Config | pydantic-settings | 환경변수 타입 안전 관리 |
| Task | Celery, Celery Beat, Redis, Flower | 비동기 작업, 주기적 스케줄링, 모니터링 |
| Storage | MinIO | S3 호환 파일 저장소 |
| Logging | Loguru | 구조화된 로깅 |
| Monitoring | Sentry, Prometheus, Grafana | 에러 트래킹, 메트릭 |
| QA | Ruff, MyPy, Bandit, pre-commit, Gitleaks | 린트, 타입, 보안 |
| Test | Pytest, pytest-cov, pytest-asyncio, Schemathesis | 테스트, API 계약 검증 |
| Security | pip-audit, Trivy | 의존성/컨테이너 취약점 |

### 5.3 AI & Data

| 영역 | 기술 | 용도 |
|------|------|------|
| Orchestration | LangGraph, LangChain | 에이전트 흐름 제어 |
| LLM | OpenAI API, Anthropic Claude API | 핵심 추론 |
| Image Gen | Nanobanana Pro | 이미지 생성 |
| Parsing | Upstage Document AI | 문서 구조 추출 |
| Graph DB | Neo4j | 지식 그래프 + 벡터 검색 |
| Embedding | Qwen3 Embedding (Local) | 문서 임베딩 |
| Reranker | Qwen3 Reranker (Local) | 검색 결과 재정렬 |
| Vision/OCR | OpenAI GPT-4 Vision, Claude Vision | 이미지 분석, 텍스트 추출 |

### 5.4 크롤링 및 자동화

| 기술 | 용도 |
|------|------|
| Playwright | 브라우저 자동화 (X, Facebook, LinkedIn, Threads 등) |
| BeautifulSoup / Scrapy | 공개 웹페이지 크롤링 |
| yt-dlp | YouTube 메타데이터 및 자막 추출 |
| feedparser | RSS/Atom 피드 파싱 (자동 수집 소스) |

### 5.5 Browser Extension

| 영역 | 기술 | 용도 |
|------|------|------|
| Framework | Plasmo | React 기반 크롬 익스텐션 |

### 5.6 Infrastructure & DevOps

| 영역 | 기술 | 용도 |
|------|------|------|
| Container | Docker, docker-compose | 개발/배포 환경 |
| CI/CD | GitHub Actions | 자동 테스트, 배포 |
| Code Analysis | SonarQube | 코드 품질 시각화 |
| Security Scan | Trivy, Snyk | 오픈소스/컨테이너 보안 |
| Load Test | k6 | API 부하 테스트 |
| Secrets | GitHub Secrets | 시크릿 관리 |

### 5.7 인프라 환경

| 단계 | 환경 |
|------|------|
| 초기 | 사내 서버 (Docker Compose) |
| 확장 시 | AWS (ECS/EKS, RDS, OpenSearch, S3, Neptune) |

---

## 6. 폴더 구조 (Monorepo)

```
infosnack-monorepo/
├── .github/workflows/             # CI/CD
├── docs/                          # 문서, ADR
├── docker/                        # Dockerfile들
│
├── docker-compose.yml
├── .env.example
├── package.json                   # 루트 (Husky)
├── pnpm-workspace.yaml
├── pyproject.toml                 # uv 워크스페이스
└── README.md
│
├── backend/
│   ├── app/
│   │   ├── api/                   # FastAPI 라우터
│   │   ├── core/                  # 설정, 보안, 예외
│   │   ├── db/                    # DB 세션, 레포지토리
│   │   ├── models/                # SQLAlchemy 모델
│   │   ├── schemas/               # Pydantic 스키마
│   │   ├── services/              # 비즈니스 로직
│   │   ├── ai/                    # LLM, 임베딩, 이미지 생성
│   │   ├── crawlers/              # 플랫폼별 크롤러
│   │   ├── search/                # Elasticsearch 클라이언트, 인덱스 관리
│   │   ├── graph/                 # Neo4j 지식 그래프
│   │   ├── workers/               # Celery 태스크
│   │   └── main.py
│   │
│   ├── alembic/                   # DB 마이그레이션
│   ├── tests/
│   ├── pyproject.toml
│   └── .pre-commit-config.yaml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/                   # Next.js App Router
│   │   ├── components/            # UI 컴포넌트
│   │   ├── hooks/                 # 커스텀 훅
│   │   ├── stores/                # Zustand 스토어
│   │   ├── lib/                   # 유틸, API 클라이언트
│   │   └── types/
│   │
│   ├── tests/
│   ├── package.json
│   └── tailwind.config.ts
│
└── extension/                     # Plasmo 크롬 익스텐션
    ├── src/
    └── package.json
```

---

## 7. 품질 관리 파이프라인

### 7.1 3단계 품질 관리 체계

```
┌─────────────────────────────────────────────────────────────────┐
│  [1] LOCAL - Pre-commit                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Husky     │  │ pre-commit  │  │  Gitleaks   │              │
│  │ lint-staged │  │ Ruff, MyPy  │  │             │              │
│  │ Commitlint  │  │   Bandit    │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Push
┌─────────────────────────────────────────────────────────────────┐
│  [2] CI - GitHub Actions                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Vitest    │  │   Pytest    │  │ Playwright  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  pip-audit  │  │   Trivy     │  │     k6      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Merge
┌─────────────────────────────────────────────────────────────────┐
│  [3] ANALYSIS - Server                                          │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │      SonarQube          │  │        Snyk             │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 단계별 검사 항목

| 단계 | 도구 | 검사 항목 |
|------|------|-----------|
| Local | Husky + lint-staged | 커밋 전 린트, 포맷팅 |
| Local | Commitlint | 커밋 메시지 규칙 |
| Local | pre-commit (Ruff, MyPy, Bandit) | Python 린트, 타입, 보안 |
| Local | Gitleaks | 시크릿 유출 방지 |
| CI | Vitest | 프론트엔드 단위 테스트 |
| CI | Pytest | 백엔드 단위/통합 테스트 |
| CI | Playwright | E2E 테스트 |
| CI | pip-audit | Python 의존성 취약점 |
| CI | Trivy | 컨테이너 이미지 취약점 |
| CI | k6 | API 부하 테스트 |
| Analysis | SonarQube | 코드 품질, 기술 부채 |
| Analysis | Snyk | 오픈소스 보안 취약점 |

---

## 8. 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        클라이언트 레이어                          │
├───────────────────┬───────────────────┬───────────────────────────┤
│ 웹 앱             │ 브라우저 확장     │ 모바일 앱 (공유시트)      │
│ (Next.js)         │                   │                           │
└─────────┬─────────┴─────────┬─────────┴─────────┬─────────────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API 레이어                               │
│                    FastAPI + 인증/인가                           │
│        + 공개 공유 다이제스트 (비인증 읽기 전용 엔드포인트)      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────────────┐
│ 워커 레이어  │      │ Graph RAG   │      │ 알림 워커           │
│ (Celery)    │      │ 챗봇 서비스  │      │ (Google Chat)       │
├─────────────┤      └──────┬──────┘      └─────────────────────┘
│ • 크롤링    │             │
│ • AI 요약   │             │
│ • 태깅      │             │
│ • 다이제스트│             │
│   큐레이션  │             │
│ • 이미지생성│             │
│ • 자동수집  │             │
│   스케줄러  │             │
│  (주기적    │             │
│   소스 확인)│             │
└──────┬──────┘             │
       │                    │
       ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        데이터 레이어                             │
├─────────────┬─────────────┬─────────────┬─────────────────────────┤
│ PostgreSQL  │ Elasticsearch│ Neo4j      │ 벡터 DB               │
│ (메인 DB)   │ (검색)       │ (그래프)   │ (임베딩)              │
├─────────────┴─────────────┴─────────────┴─────────────────────────┤
│                    Redis (캐시/큐) + S3 (파일)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. 데이터 모델 초안

### 9.1 주요 엔티티

```
User (사용자)
- id: UUID
- email: String
- name: String
- created_at: DateTime
- updated_at: DateTime
```

```
Content (콘텐츠)
- id: UUID
- url: String (unique)
- title: String
- platform: Enum (web, youtube, x, facebook, linkedin, threads, reddit, email)
- original_created_at: DateTime (nullable)
- collected_at: DateTime
- raw_content: Text (Markdown)
- summary: Text
- thumbnail_url: String
- author: String (nullable)
- og_metadata: JSON
- crawl_depth: Integer
- reading_time: Integer (예상 읽기 시간, 분, nullable)
- collected_by: FK(User)
- source_id: FK(CollectionSource) (nullable; 자동 수집된 콘텐츠의 출처, 수동 수집이면 null)
```

```
CollectionSource (수집처)
- id: UUID
- name: String
- url: String
- source_type: Enum (rss, account, webpage)
- extract_scope: Enum (full, summary, region)   # 본문 범위 (full=전체 본문 기본값)
- crawl_depth: Integer (기본 0 = 해당 항목만)
- auto_tags: JSON (이 소스로 들어온 콘텐츠에 자동 부여할 태그)
- schedule_interval: String (예: hourly, daily, custom)
- status: Enum (active, paused, failed)
- last_collected_at: DateTime (nullable)
- last_run_status: String (nullable)
- last_run_item_count: Integer (nullable, 최근 수집 건수)
- created_by: FK(User)
- created_at: DateTime
```

```
Tag (태그)
- id: UUID
- name: String (unique)
- is_auto_generated: Boolean
```

```
ContentTag (콘텐츠-태그 연결)
- content_id: FK(Content)
- tag_id: FK(Tag)
```

```
ContentImage (콘텐츠 이미지)
- id: UUID
- content_id: FK(Content)
- original_url: String
- local_path: String
- caption: Text (AI 생성 캡션)
- ocr_text: Text (추출된 텍스트)
- analysis: JSON (상세 분석 결과)
- image_type: Enum (photo, diagram, chart, screenshot, code, infographic)
- created_at: DateTime
```

```
ReadStatus (읽음 상태)
- user_id: FK(User)
- content_id: FK(Content)
- is_read: Boolean
- read_at: DateTime (nullable)
```

```
Bookmark (북마크)
- user_id: FK(User)
- content_id: FK(Content)
- created_at: DateTime
```

```
Digest (다이제스트)
- id: UUID
- type: Enum (daily, weekly)
- period_start: Date
- period_end: Date
- summary: Text
- trending_topics: JSON
- thumbnail_url: String
- generated_at: DateTime
- status: Enum (draft, published)
- share_token: String (unique, 공개 공유용 추측 불가 토큰)
- is_public: Boolean
- published_at: DateTime (nullable)
- curated_by: FK(User) (nullable, 확정한 사용자)
```

```
DigestContent (다이제스트-콘텐츠 선정)
- digest_id: FK(Digest)
- content_id: FK(Content)
- position: Integer (다이제스트 내 정렬 순서)
- is_ai_recommended: Boolean (AI 추천 여부)
- editorial_note: Text (nullable, 큐레이터 코멘트)
```

### 9.2 지식 그래프 스키마 (Neo4j)

**노드 타입**

```
(:Content {id, title, url, platform, collected_at})
(:Entity {name, type})  # type: person, technology, company, concept
(:Tag {name})
(:User {id, name})
```

**관계 타입**

```
(:Content)-[:MENTIONS]->(:Entity)
(:Content)-[:TAGGED_WITH]->(:Tag)
(:Content)-[:RELATED_TO]->(:Content)
(:Content)-[:COLLECTED_BY]->(:User)
(:Entity)-[:RELATED_TO]->(:Entity)
```

---

## 10. 개발 로드맵

> **MVP 범위**: Phase 1~4는 모두 MVP 핵심 루프에 포함된다. 정보 수집·검색(Phase 1~2), **다이제스트(Phase 3)**, **전역/콘텐츠 한정 챗봇(Phase 4, Graph RAG)** 까지가 MVP 산출물이다. Phase 5부터가 고도화 단계다.

### Phase 1: 핵심 루프 구축 (4~6주) — MVP

- 프로젝트 셋업 (Next.js + FastAPI + PostgreSQL + Docker)
- 사용자 인증 시스템 (초대 기반 회원가입 포함)
- Chrome 확장 프로그램 개발
- 공개 웹 크롤러 구현
- 이미지 추출 및 저장 파이프라인
- 이미지 분석 및 OCR 파이프라인 (Vision API + OCR)
- AI 요약 및 태깅 파이프라인
- 기본 웹 UI (목록, 검색, 필터)
- Elasticsearch 연동 (OCR 텍스트 포함)
- 자동 수집 기반 (수집처 등록 UI, 소스 자동 감지, Celery Beat 스케줄러, 일반 웹/RSS 자동 수집)

### Phase 2: 플랫폼 확장 (4~6주) — MVP

- YouTube 크롤러 (자막 추출 포함)
- X, Facebook, LinkedIn, Threads 크롤러 (Playwright)
- Reddit 크롤러
- 이메일/뉴스레터 파서
- 모바일 공유 시트 연동 (React Native 또는 Flutter)
- Nanobanana Pro 연동 (썸네일 생성)
- 계정형(X·LinkedIn 등 브라우저 자동화) 자동 수집
- 수집처 관리 화면 (상태·최근 수집 건수, 일시중지/재개/편집/삭제, 실패 시 자동 일시중지+알림)

### Phase 3: 다이제스트 (3~4주) — MVP

- 일간/주간 다이제스트 자동 생성
- 트렌드 분석 및 주요 토픽 추출
- 다이제스트 큐레이션 (AI 후보 추천 → 사용자 검토·편집·확정)
- 공개 공유 링크 (추측 불가 토큰, 비인증 읽기 전용, 링크 복사)
- 다이제스트 대표 이미지 생성
- Google Chat 다이제스트 알림 연동

### Phase 4: Graph RAG 챗봇 (4~6주) — MVP

- Neo4j 셋업 및 스키마 설계
- 콘텐츠 수집 시 엔티티 추출 파이프라인
- 지식 그래프 자동 구축
- 벡터 DB 연동 (임베딩 저장)
- Graph RAG 질의응답 파이프라인
- 챗봇 UI 개발

### Phase 5: 고도화 (이후)

- 개인/팀 라이브러리 분리
- 하이라이트 및 메모 기능
- 콘텐츠 간 연결 시각화 (지식 그래프 뷰)
- 유사 콘텐츠 추천
- 인사이트 대시보드
- 자동 수집 고급 레시피 (까다로운 사이트 영역 직접 지정, P2)
- AWS 마이그레이션

---

## 11. 성공 지표

| 지표 | 목표 |
|------|------|
| 주간 활성 사용자 수 | 팀원 전원 (5~6명) |
| 주당 수집 콘텐츠 수 | 30개 이상 |
| 다이제스트 열람률 | 80% 이상 |
| 챗봇 질의 수 | 주 20회 이상 |
| 콘텐츠 검색 사용률 | 주 1회 이상/인 |
| 북마크 저장 콘텐츠 수 | 주 10개 이상 |

---

## 12. 리스크 및 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|:------:|-----------|
| SNS 크롤링 차단 | 높음 | 브라우저 자동화, 세션 관리 고도화, 프록시 활용 |
| AI API 비용 증가 | 중간 | Ollama로 로컬 모델 병행, 배치 처리 최적화 |
| 사용자 참여 저조 | 높음 | 입력 편의성 극대화, 알림 최소화, 챗봇으로 가치 체감 |
| 데이터 유실 | 높음 | 정기 백업, DB 이중화 구성 |
| Graph RAG 정확도 | 중간 | 엔티티 추출 품질 개선, 피드백 루프 구축 |
| 공개 공유 링크 노출 | 중간 | 추측 불가능한 토큰, 공개 뷰는 읽기 전용·최소 정보 노출, 필요 시 링크 비활성화 기능 |
| 자동 수집 소스 방치/중복 누적 | 중간 | 수집처 관리 화면(상태·최근 수집 건수), 최소 주기 가이드, 중복 항목 건너뛰기 |
| 사이트 구조 변경으로 수집 실패 | 중간 | 반복 실패 시 자동 일시중지 + 알림, 관리 화면에서 상태 확인·재개 |

---

## 부록: Graph RAG vs 일반 RAG 비교

| 항목 | 일반 RAG | Graph RAG |
|------|----------|-----------|
| 데이터 구조 | 플랫 문서 + 벡터 | 문서 + 그래프 + 벡터 |
| 검색 방식 | 벡터 유사도 | 벡터 + 그래프 탐색 |
| 맥락 이해 | 개별 문서 단위 | 문서 간 관계까지 파악 |
| 멀티홉 질의 | 어려움 | 자연스러움 |
| 구현 복잡도 | 낮음 | 높음 |
| 적합한 질문 | "X에 대해 알려줘" | "X와 Y의 관계는?", "X를 언급한 모든 글은?" |

**이 프로젝트에서 Graph RAG가 유리한 이유**

- 콘텐츠 간 관계(같은 주제, 같은 저자, 관련 기술)를 파악해야 함
- "최근 트렌드"처럼 여러 콘텐츠를 종합하는 질문이 많음
- 시간이 지나면서 지식이 축적되어 연결 관계가 중요해짐

---

— End of Document —
