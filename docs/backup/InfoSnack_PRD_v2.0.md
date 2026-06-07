# InfoSnack (인포스낵) — PRD v2.0

> **Product Requirements Document**
> 버전: 2.0 | 작성일: 2026-06-05 | 기반: v1.0 + deep-research 3회 검증 + E2E 구현 디테일
> 대상 팀: AI Agent 팀에서 시작 → **사내 여러 팀으로 확장**

---

## 문서 안내 (이 PRD를 읽는 법)

이 문서는 v1.0(제품 정의)을 뼈대로, 3회의 deep-research 검증과 E2E 구현 디테일(데이터 모델 SQL·API 명세·테스트 전략)을 입힌 **개발 착수용** PRD다. **이 문서 + 화면설계.md를 함께 보면 E2E 개발이 가능한 수준**을 목표로 한다.

### 관련 문서 맵
| 문서 | 역할 | 관계 |
|------|------|------|
| **InfoSnack_PRD_v2.0.md** (이 문서) | 제품 정의·기능·아키텍처·데이터·API·테스트·로드맵 | 제품/기술의 SoT |
| **InfoSnack_화면설계.md** | UI/UX 상세·화면별 와이어프레임·인터랙션·반응형·다크모드 | **UI의 SoT** (§14에서 화면 ID로 참조) |
| **openapi/infosnack-api.yaml** | OpenAPI 3.1 API 계약(request/response schema·에러·권한·웹훅·스트리밍) | **API 계약의 SoT** (§13) |
| InfoSnack_PRD_v1.0.md | 원본 PRD | 히스토리(보존) — 본 v2.0이 대체 |
| InfoSnack_자동수집_기획서_v1.0.md | 자동수집 상세 기획 | v1.0/§5에 이미 반영됨 |

> **역할 분담**: 제품·기술 질문 → 이 PRD. "이 화면이 어떻게 생겼나" → 화면설계.md. 둘이 충돌하면 **제품/기술은 PRD, UI는 화면설계**가 우선.

### 신뢰 등급 표기
| 표기 | 의미 |
|------|------|
| 🟢 **[검증됨]** | deep-research에서 primary 출처 + 3-vote 적대적 검증 통과 |
| 🟡 **[표준지식]** | 업계 표준 엔지니어링 패턴 (근거 명시) |
| 🔴 **[가정]** | 검증/실측 전 가정값. 변경 가능 |
| ⚠️ **[리스크]** | 기술/운영 리스크. §23 레지스터 연동 |

> v1.0 대비 변경점은 각 절에 **[v1.0→v2.0]**으로 표기한다.

### 📑 목차
0. [확정 기술 스택](#0-확정-기술-스택) · 1. [서비스 브랜딩](#1-서비스-브랜딩) · 2. [제품 개요](#2-제품-개요) · 3. [사용자·팀 구조](#3-사용자팀-구조) · 4. [기능 명세](#4-기능-명세) · 5. [정보 수집 아키텍처](#5-정보-수집-아키텍처) · 6. [콘텐츠 처리 파이프라인(LangGraph)](#6-콘텐츠-처리-파이프라인-langgraph) · 7. [이미지 분석·OCR](#7-이미지-분석ocr) · 8. [검색(Postgres 하이브리드)](#8-검색-postgres-하이브리드) · 9. [Graph RAG 챗봇](#9-graph-rag-챗봇-neo4j--후속-단계) · 10. [다이제스트](#10-다이제스트) · 11. [알림](#11-알림) · 12. [데이터 모델](#12-데이터-모델) · 13. [API 설계](#13-api-설계-fastapi) · 14. [프론트엔드 설계](#14-프론트엔드-설계) · 15. [브라우저 확장](#15-브라우저-확장-plasmo) · 16. [인증·권한·멀티팀](#16-인증권한멀티팀) · 17. [시스템 아키텍처](#17-시스템-아키텍처) · 18. [인프라·DevOps](#18-인프라devops) · 19. [비기능 요구사항](#19-비기능-요구사항-nfr) · 20. [품질·테스트 전략](#20-품질테스트-전략) · 21. [개발 로드맵](#21-개발-로드맵) · 22. [성공지표](#22-성공지표) · 23. [리스크·오픈이슈](#23-리스크오픈이슈) · [부록](#부록-a-2025-2026-기술-결정-노트-deep-research-검증)

---

## 0. 확정 기술 스택

> **[v1.0→v2.0]** 패키지매니저 pnpm→**bun**, 검색 Elasticsearch→**Postgres 하이브리드**, 별도 벡터DB→**pgvector**, Graph RAG(Neo4j)는 **후속 단계로 명확히 분리**. 나머지는 v1.0 유지.

### 0.1 Frontend (Next.js + bun)
| 영역 | 기술 |
|------|------|
| Core | **Next.js 16**(App Router) · React · TypeScript |
| Styling | Tailwind CSS · shadcn/ui · Lucide |
| Animation | Framer Motion |
| State | Zustand(클라이언트) · **TanStack Query**(서버 상태) |
| Form | React Hook Form · Zod |
| Auth | NextAuth.js v5 (Auth.js) |
| i18n | next-intl (한/영) |
| Runtime/PM | **bun** |
| QA/Test | ESLint · Prettier · Husky · lint-staged · Commitlint · **Vitest** · **Playwright(E2E)** · Sentry |

### 0.2 Backend (FastAPI + uv)
| 영역 | 기술 |
|------|------|
| Core | Python 3.12+ · **FastAPI** · **Pydantic v2** · **uv** |
| DB | **PostgreSQL 16+** · **pgvector** · SQLAlchemy 2.0(async) · asyncpg · Alembic |
| 검색 | **Postgres `tsvector`(전문) + pgvector(벡터) 하이브리드 + RRF** |
| Task | **Celery + Celery Beat + Redis + Flower** |
| Storage | **MinIO**(S3 호환) |
| Config/Log | pydantic-settings · Loguru |
| Monitoring | Sentry · Prometheus · Grafana |
| QA/보안 | Ruff · MyPy · Bandit · pre-commit · Gitleaks · pip-audit · Trivy |
| Test | **Pytest · pytest-cov · pytest-asyncio · Schemathesis** |

### 0.3 AI & Data
| 영역 | 기술 |
|------|------|
| Orchestration | **LangGraph · LangChain** |
| LLM | **OpenRouter API**. 초기 메인 모델 `~anthropic/claude-sonnet-latest`(입력 text+image, 출력 text, 1M context). 관리자 설정에서 OpenRouter 모델 ID 변경 가능 |
| Image Gen | Nanobanana Pro (썸네일·다이제스트 대표 이미지) |
| Parsing | Upstage Document AI |
| Vision/OCR | 메인 LLM 모델의 image input으로 이미지 이해·OCR 보강. Upstage Document AI 결과와 함께 사용 |
| Embedding | **OpenRouter API** `qwen/qwen3-embedding-8b`(text→embeddings, 32K context, $0.01/M input tokens). 초기 dimension은 **4096** |
| Reranker | **OpenRouter API** `cohere/rerank-4-fast`(text→rerank, 33K context, $0.002/search). 하이브리드 검색 상위 후보 재정렬 |
| Web Search | `WebSearchProvider` 추상화. 초기 구현은 Tavily 또는 동등한 웹 검색 API로, 콘텐츠 한정 챗봇에서 본문 근거가 부족한 관련 질문에만 자동 보강 |
| **Graph RAG** | **Neo4j** — ⚠️ **후속 단계**(§9). 현재 개발 범위는 Postgres 하이브리드 검색 + 일반 RAG |

### 0.4 크롤링·자동화
| 기술 | 용도 |
|------|------|
| Playwright | 브라우저 자동화 (X·Facebook·LinkedIn·Threads) |
| BeautifulSoup / Scrapy | 공개 웹페이지 |
| yt-dlp | YouTube 메타·자막 |
| feedparser | RSS/Atom (자동 수집) |

### 0.5 확장·인프라
- **Browser Extension**: Plasmo (Chrome/Safari)
- **Container**: Docker · docker-compose
- **CI/CD**: GitHub Actions
- **인프라**: 초기 사내 서버(Docker Compose) → 확장 시 AWS(ECS/EKS·RDS·S3 등)

### 0.6 품질 게이트 (전사 강제)
- **TDD**(Red-Green-Refactor) · 코드 커버리지 **85%+**(CI 게이트) · **Playwright E2E**

---

## 1. 서비스 브랜딩

> v1.0 그대로 유지. (변경 없음)

### 1.1 서비스명
| 구분 | 이름 |
|------|------|
| 영문 | **InfoSnack** |
| 한글 | **인포스낵** |

### 1.2 슬로건
- "정보를 간편하게, 한 입 크기로"
- "Snack your information"

### 1.3 BI 콘셉트
- **한글 로고**: "인"의 ㅇ 위치에 깨진 과자 이미지, 둥근 폰트로 친근·가벼운 느낌
- **영문 로고**: 과자 봉지 패키지 디자인 + "InfoSnack" 텍스트 + 과자 일러스트, "+" 아이콘으로 정보 수집 의미

### 1.4 브랜드 컬러
**Primary**: 스카이 블루 `#18AEF6` (밝은 `#19AFF7` / 어두운 `#16AAF1`)
**Secondary**: 과자 노란색 `#FBDB5B` / Snack Gold `#F9D854`
**Accent**: 과자 테두리 브라운 `#A38F52` / Brown Dark `#776C34`
**Neutral**: White `#FFFFFF` · Surface `#F5F7FA` · Gray `#9E9E9E` · Gray Dark `#333333` · Text Secondary `#666666` · Border `#E0E0E0`
**Dark Mode**: BG `#1A1A2E` · Surface `#252540` · Card `#2D2D4A` · Border `#3A3A5A` · Text `#FFFFFF`/`#A0A0A0` · Primary `#18AEF6` · Accent `#FBDB5B`

> **구현 메모** 🟡: 위 컬러를 Tailwind 디자인 토큰(`tailwind.config.ts`의 `theme.extend.colors`) + shadcn/ui CSS 변수(`--primary` 등)로 정의. 다크모드 기본 지원(개발자 타깃).

### 1.5 컬러 활용
| 요소 | 컬러 |
|------|------|
| 메인 버튼·헤더 | Primary Blue `#18AEF6` |
| 호버/액티브 | Primary Blue 어두운 `#16AAF1` |
| 강조·알림 뱃지 | Snack Yellow `#FBDB5B` |
| 링크·아이콘 | Primary Blue |
| 본문 텍스트 | Gray Dark `#333333` |
| 카드 배경 | Surface `#F5F7FA` |

### 1.6 로고 사용
| 용도 | 권장 |
|------|------|
| 웹 헤더 | 한글/영문(대상별) |
| 앱 아이콘·파비콘 | 과자 이미지 |
| 다이제스트 헤더 | 한글 버전 |
| 공유 썸네일 | 영문 봉지 |

---

## 2. 제품 개요

### 2.1 한 문장 정의
> **InfoSnack는 팀원이 여러 플랫폼에서 발견한 정보를 손쉽게 저장하고(+자주 보는 출처는 자동 수집), AI가 요약·태깅·이미지분석으로 정리하며, 하이브리드 검색과 챗봇으로 다시 찾고, 주간 다이제스트로 팀과 공유하는 사내 지식관리 도구다.**

### 2.2 배경 및 문제점
팀원들이 여러 플랫폼(YouTube·웹·X·Facebook·LinkedIn·Threads·Reddit·뉴스레터 등)에서 유용한 정보를 발견하지만, 체계적으로 관리·공유하기 어렵다.
- 개인 메신저 '나에게 보내기'로 저장 → 나중에 못 찾음
- 슬랙 공유는 대화에 묻히고, 노션 정리는 결국 안 보게 됨
- 정보가 파편화 → 팀 전체 지식 공유가 안 됨
- 공유가 불편 → 지속적 정보 수집이 어려움

### 2.3 목표
- **정보 수집의 편의성 극대화**: 어떤 플랫폼에서든 쉽게 저장
- **자동화된 정리·요약**: AI 태깅·요약·썸네일·이미지분석
- **팀 단위 지식 공유**: 주간 다이제스트로 공유·축적
- **지능형 질의응답**: RAG 챗봇(→ 후속 Graph RAG)으로 축적 지식에 질의응답

### 2.4 핵심 가치 제안
> **"좋은 인풋이 좋은 아웃풋을 만든다"**
단순 수집을 넘어, 팀의 집단 지성을 키우고 축적된 지식을 손쉽게 공유·검색하는 지식 관리 시스템.

### 2.5 제품 정체성 — 범용 + AI 프리셋
> InfoSnack은 **범용 정보 수집·지식관리 도구**다. 어떤 플랫폼의 어떤 정보든 저장·검색할 수 있다. 다만 주 사용자가 AI 팀이므로 **AI 정보에 대한 프리셋을 기본 제공**해, AI팀이 설정 없이 바로 가치를 얻게 한다.

| 영역 | 범용(기본) | AI 프리셋(기본 제공) |
|------|-----------|---------------------|
| 자동수집 소스 | 사용자가 원하는 출처 자유 등록 | **arXiv·Hugging Face·GitHub Trending·Hacker News·주요 AI 블로그**(OpenAI/Anthropic/DeepMind 등)를 **원클릭 추가 프리셋**으로 제공 (§5.3) |
| 카테고리 | 자유 태그 | **model_release·paper·tool·benchmark·opinion** 등 AI 카테고리 프리셋 |
| 다이제스트 트렌드 | 일반 토픽 추출 | AI 토픽(신규 모델·기법·툴) 우선 추출 프리셋 |

- 즉 **엔진은 범용, 기본 설정은 AI 최적화**. 비-AI 정보도 동일하게 수집·검색·다이제스트된다.
- 프리셋은 끄거나 바꿀 수 있다(다른 팀이 다른 도메인으로 쓸 수 있도록).

### 2.6 비목표 (Non-Goals)
- ❌ 사업화·외부 판매·과금 (사내 도구)
- ❌ 외부 고객 멀티테넌시(SaaS식 격리) — 사내 여러 팀은 §16 방식으로 가볍게
- ❌ 법적 컴플라이언스(소스 약관 등)는 고려 대상 아님 — 단, 차단·rate limit은 "안정 수집" 엔지니어링 문제로 다룸(§5)
- ❌ 자체 LLM 학습 (외부 API 사용)

---

## 3. 사용자·팀 구조

### 3.1 사용자
> **[v1.0→v2.0]** "AI Agent 팀 5~6명"에서 **사내 여러 팀으로 확장**.

| 유형 | 누구 | 핵심 니즈 |
|------|------|----------|
| **AI 엔지니어** (Primary) | LLM/RAG/Agent 앱 개발자 | 발견한 자료 저장·재발견, 신기술 추적 |
| **AI 연구자** | 논문·기법 추적 | 특정 주제 흐름 추적, 과거 자료 검색 |
| **제품/기획** | 동향 파악 | 주간 다이제스트로 맥락 요약 |
| **팀 관리자/운영자** | 도구·소스 운영 | 수집처 관리, 파이프라인 모니터링, 팀/권한 관리 |

### 3.2 팀·라이브러리 구조
| 단계 | 구조 |
|------|------|
| **현재 개발 범위** | 팀 공용 라이브러리. 콘텐츠는 기본 전사(또는 팀) 공유 |
| **후속 확장** | 개인 라이브러리 ↔ 팀 공유 라이브러리 분리, 역할 기반 권한(§16) |

> **멀티팀 정책** 🔴: 현재 개발 범위는 "여러 팀이 같은 인스턴스를 쓰되, 콘텐츠는 공유 + 팀 단위 관심사/필터로 구분". 팀 간 데이터 격리(완전 분리)는 필요 시 §16에서 단계적 강화. (외부 SaaS식 테넌시는 비목표)

---

## 4. 기능 명세

> **범위 원칙**: 후속으로 명시한 항목을 제외한 모든 기능은 현재 개발 범위에 포함한다. 이 문서는 기능을 선택적으로 나누기보다, 실제 출시까지 구현해야 할 전체 범위를 정의한다.

| ID | 기능 | 개발 범위 | 영역 | 상세 |
|----|------|---------|------|------|
| F-01 | 수동 수집(브라우저 확장·공유시트·링크 추가 모달) | **현재 개발 범위** | 수집 | §5.2 |
| F-02 | 자동 수집(RSS·계정·웹, 주기 스케줄) | **현재 개발 범위** | 수집 | §5.3 |
| F-03 | 크롤링·정규화·저장(멀티플랫폼) | **현재 개발 범위** | 처리 | §5.4 |
| F-04 | 이미지 분석·OCR | **현재 개발 범위** | 처리 | §7 |
| F-05 | AI 요약·태깅(기존 태그 택소노미 매핑)·썸네일 | **현재 개발 범위** | 처리 | §6 |
| F-06 | 하이브리드 검색(전문+벡터, 글로벌 검색바) | **현재 개발 범위** | 소비 | §8 |
| F-07 | 태그·카테고리·기간·읽음·북마크 필터 | **현재 개발 범위** | 소비 | §8.4 |
| F-08 | 주간/일간 다이제스트(큐레이션·공개공유) | **현재 개발 범위** | 소비 | §10 |
| F-09 | 계정·인증(초대 기반)·팀 | **현재 개발 범위** | 플랫폼 | §16 |
| F-10 | RAG 챗봇(전역 + 콘텐츠 한정 SlidePanel) | **현재 개발 범위** | 소비 | §9 |
| **F-11** | **홈 대시보드**(통계·최근·읽지 않음·다이제스트 프리뷰) | **현재 개발 범위** | 소비 | §13·§14 |
| **F-12** | **탐색**(태그별 E-01 / 플랫폼별 E-02 / 타임라인 E-03 / 카테고리별 E-04) | **현재 개발 범위** | 소비 | §8.5 |
| **F-13** | **콘텐츠 메모**(수집 시 사용자 메모) | **현재 개발 범위** | 소비 | §5.2 |
| F-14 | 알림·웹훅(Google Chat·Slack·Webhook) | **현재 개발 범위** | 통합 | §11 |
| F-15 | 수집처 관리 화면(상세/편집 AC-03 포함) | **현재 개발 범위** | 운영 | §5.5 |
| F-16 | 관리자 대시보드(파이프라인 모니터링) | **현재 개발 범위** | 운영 | §17 |
| F-17 | 데이터 내보내기(JSON/CSV/Markdown) | **현재 개발 범위** | 운영 | §12.4 |
| F-18 | i18n(한/영) | **현재 개발 범위** | 플랫폼 | §14 |
| F-19 | **Graph RAG(Neo4j)** | **후속** | 소비 | §9 |
| F-20 | 개인/팀 라이브러리 분리·권한 | **후속** | 협업 | §16 |
| F-21 | 인사이트 대시보드(트렌드·팀 활동 통계, I-01) | **후속** | 분석 | §17 |
| F-22 | 본문 하이라이트·주석 + 읽기 위치 보존 | **현재 개발 범위** | 소비 | §8.6 |
| F-23 | 유사 콘텐츠 추천 | **후속 검토** | 분석 | — |
| F-24 | 콘텐츠 번역(원문→한/영, per-item) | **현재 개발 범위** | 소비 | §6.5 |
| F-25 | 벌크·소급 AI 재태깅 | **현재 개발 범위** | 운영 | §6.4 |

> **메모 구분**: **F-13(콘텐츠 메모)**는 수집 시 콘텐츠에 남기는 한 줄 메모(링크 추가 모달·화면설계 H-02). **F-22(본문 하이라이트·주석)**는 콘텐츠 본문 특정 부분에 형광펜+주석 + 다시 볼 때 읽던 위치 복원(읽기 위치 보존). 둘은 다른 기능이다.
> **벤치마크 근거(deep-research)**: F-05 기존 태그 매핑/F-25 소급 재태깅은 Karakeep·Linkwarden 패턴, F-22 하이라이트·읽기위치는 Omnivore 패턴, F-24 번역은 Folo 패턴, F-14 웹훅·Slack은 Miniflux 패턴, AI 모델 provider 추상화(§6.4)는 Karakeep/Linkwarden의 모델 전환 패턴 — 모두 primary 출처 검증(부록 D).

### 핵심 기능 상세

**F-01 수동 수집** — 브라우저 확장(Chrome/Safari)·모바일 공유시트(iOS Share Extension/Android Share Intent)로 링크 전달 → 서버 크롤링 트리거. AC: 어느 플랫폼에서든 2클릭 내 저장, 저장 즉시 처리 큐 적재.

**F-02 자동 수집** — 자주 보는 출처를 등록하면 주기마다 **새 항목만** 자동 수집(§5.3). AC: 소스 종류 자동 감지, 등록 시 1회 시범 수집 미리보기, 중복 항목 건너뜀.

**F-03 크롤링·정규화·저장** — 플랫폼별 크롤러로 본문·이미지·메타 추출 → 표준 스키마. AC: 텍스트는 Markdown, 이미지/비디오 원본 저장, OG·작성자·작성일·플랫폼 메타 보존, depth 설정(기본 1).

**F-04 이미지 분석·OCR** — 본문 이미지의 캡션 생성·OCR·차트/코드 인식(§7). AC: OCR 텍스트가 검색 대상에 포함.

**F-05 AI 요약·태깅·썸네일** — 요약(이미지 분석 포함)·자동 태깅(사용자+AI)·대표 썸네일 생성. AC: 요약 사실 정확도 ≥95%(샘플), 원문 근거 보존.

**F-06 하이브리드 검색** — `tsvector`(전문) + pgvector(벡터) + RRF(§8). AC: 자연어/키워드 모두, OCR 텍스트 포함, p95 < 500ms 🔴.

**F-08 다이제스트** — AI가 후보 추천(초안) → 사용자가 검토·편집·확정(배포) → 공개 공유 링크(추측 불가 토큰, 비인증 읽기전용)(§10).

**F-10 RAG 챗봇** — 축적 콘텐츠에 자연어 질의응답, 출처 인용. 전역 챗봇은 전체 저장 콘텐츠에서 검색하고, 콘텐츠 한정 챗봇은 현재 보고 있는 문서 본문을 1차 근거로 답한다. 현재 개발 범위는 하이브리드 검색 기반 RAG이며, **후속으로 Graph RAG를 강화**한다(F-19/§9).

**F-11 홈 대시보드** — 로그인 후 첫 화면(H-01). 통계 카드(이번 주 수집·읽지 않음·트렌드 태그), 이번 주 다이제스트 프리뷰, 최근 추가·읽지 않은 콘텐츠 섹션. AC: 각 위젯은 "전체보기"로 해당 목록 이동.

**F-12 탐색** — 라이브러리를 다른 축으로 탐색. 태그별(E-01) / 플랫폼별(E-02) / 타임라인(E-03) / 카테고리별(E-04)을 모두 현재 개발 범위에 포함한다. AC: 태그·카테고리 클릭 시 해당 필터가 적용된 라이브러리로 이동.

**F-13 콘텐츠 메모** — 수집(링크 추가 모달·확장) 시 콘텐츠에 한 줄 메모 첨부. 상세에서 열람·수정. (본문 하이라이트=F-22와 별개)

**F-22 본문 하이라이트·주석 + 읽기 위치 보존** — 콘텐츠 상세(L-02) 본문에서 텍스트를 선택해 형광펜·주석을 남기고, 다시 열 때 마지막으로 읽던 위치를 복원. 하이라이트·주석은 개인별. AC: 선택→하이라이트(색상)→주석 입력, 하이라이트 목록 보기, 재방문 시 스크롤 위치 복원. (Omnivore 패턴, 부록 D)

**F-24 콘텐츠 번역** — 콘텐츠 상세에서 원문/요약을 사용자 언어(한↔영)로 번역해 보기. 영어 AI 자료가 많은 환경 대응. AC: "번역 보기" 토글, 번역 결과 캐시(재요청 비용 절감), 원문/번역 전환. (Folo 패턴)

**F-25 벌크·소급 AI 재태깅** — 이미 수집된 콘텐츠를 기존 태그 택소노미 기준으로 일괄 재분류·재태깅. 태그 체계 변경 시 과거 자산에 소급 적용. AC: 범위 선택(전체/필터)→재태깅 잡(Celery)→진행 표시. (운영자, 화면설계 S-03)

---

## 5. 정보 수집 아키텍처

> InfoSnack의 수집은 **두 경로**다: ① 사람이 직접 저장(수동) ② 등록 소스 자동 수집. 두 경로 모두 **동일한 처리 파이프라인(§6)에 합류**한다.
> 사내 도구라 소스 약관·저작권 등 법적 리스크는 비고려. 단, **차단·rate limit은 "안정 수집" 엔지니어링 문제**로 다룬다.

### 5.1 수집 계층 개요
```
[수동] 브라우저확장/공유시트 ─┐
                              ├─► [Capture API] ─► [크롤링 큐(Celery)] ─► [Crawler]
[자동] Celery Beat 스케줄러 ──┘                                              │
        (등록 소스 주기 확인, 새 항목만)                                     ▼
                                                          [RawContent 적재 + url 중복체크]
                                                                            │
                                                                            ▼
                                                          [콘텐츠 처리 파이프라인 §6]
```
- **커넥터/크롤러 패턴** 🟡: 플랫폼마다 `BaseCrawler`(`fetch(url|source) -> RawContent`) 구현 → 신규 플랫폼 플러그인처럼 추가
- **중복 방지**: `contents.url` 유니크 + url 정규화 해시. 자동 수집은 "마지막 확인 이후 새 항목"만

### 5.2 수동 수집 (F-01, F-13)
- **브라우저 확장(Plasmo)**: 현재 페이지 URL+선택 텍스트를 Capture API로 전송 (§15)
- **모바일 공유시트**: iOS Share Extension / Android Share Intent로 링크 공유
- **링크 추가 모달**(헤더 `[+ 추가]`·단축키 Cmd/Ctrl+N, 화면설계 H-02): URL + **수집 범위(depth)** + **메모(note, F-13)** + 태그 직접 입력
- 저장 즉시 처리 큐 적재, "저장 중→완료" 진행 표시(크롤링→요약→태깅) → 백그라운드 처리
- **콘텐츠 메모(F-13)**: 수집 시 남긴 한 줄 메모는 `contents.note`에 저장, 상세에서 열람·수정

### 5.3 자동 수집 (F-02)
> v1.0 §3.1.2 그대로 계승. 핵심: "한 번 등록하면 알아서 쌓인다."

**수집처 추가 (계층형 UX)**
| 단계 | 내용 | 비고 |
|------|------|------|
| 1단계 붙여넣기 | 주소 붙이면 종류 자동 감지 + 기본값(추출=전체 본문) | 대부분 여기서 끝 |
| 2단계 핵심 옵션 | 본문 범위·수집 주기·자동 태그 조정 | 옵션 펼침 |
| 3단계 고급 레시피 | 가져올 영역 직접 지정 | 고급 사용자용 |

- **소스 종류 자동 감지**: 주소 보고 RSS / 계정형(X·LinkedIn·Reddit) / 일반 웹 판단 → 기본값. 수동 변경 가능
- **등록 시 1회 시범 수집 미리보기** — 저장 전 제대로 들어오는지 확인
- **추출 옵션**: 본문 범위(전체/요약/특정영역), 링크 따라가기 depth(기본 0=해당 항목만), 자동 태그
- **실행**: 주기(매시간/하루1회/직접입력)마다 새 항목만, 최소 간격 가이드

**AI 소스 프리셋 (§2.5 정체성)** 🟡
- 수집처 추가 화면(AC-02)에 **"AI 프리셋"** 묶음 제공 → 원클릭으로 핵심 AI 소스 일괄 등록:
  - arXiv(cs.AI/cs.CL/cs.LG), Hugging Face(models/papers), GitHub Trending(AI 토픽), Hacker News(AI 키워드), 주요 AI 블로그 RSS(OpenAI/Anthropic/Google DeepMind/HF 등)
- 각 프리셋 소스는 §5.4의 수집 방식·rate limit을 따른다(arXiv 1요청/3초, GitHub PAT, HF 토큰·`RateLimit` 헤더 🟢)
- 프리셋에 **AI 카테고리·자동 태그**가 기본 매핑됨(예: arXiv→`paper`, GitHub→`tool`)
- 프리셋은 선택사항 — 다른 팀은 자기 도메인 소스를 자유 등록

### 5.4 멀티플랫폼 크롤링 (F-03)
| 플랫폼 | 방식 | rate limit / 안정 수집 메모 |
|--------|------|----------------------------|
| 공개 웹/블로그 | 직접 크롤링(BeautifulSoup/Scrapy) | robots·간격 준수, ETag 조건부 |
| YouTube | API + yt-dlp 자막 | 영상 요약 가능 |
| X·Facebook·LinkedIn·Threads | Playwright 브라우저 자동화(로그인 세션) | Facebook·LinkedIn·Threads는 필수 수집 대상. X도 현재 개발 범위. 차단·구조변경 시 실패 자동 일시중지(§5.5) |
| Reddit | API 또는 크롤링 | 🟢 차단·rate limit만 기술 관리 |
| 이메일/뉴스레터 | 포워딩/업로드 파싱 | 전용 수신 주소 |
| RSS/Atom | feedparser | 조건부 요청 저비용 |
| arXiv | OAI-PMH+API | 🟢 공식 ToU 기준 legacy API/OAI-PMH/RSS 전체에 **1요청/3초 + 단일 connection**. API page는 `start`/`max_results` 사용, slice는 2,000 이하 권장 |
| GitHub | REST API | 🟢 미인증 60/hr, 인증 사용자/PAT 5,000/hr. secondary limit(동시 100 요청, REST 900 points/min) 준수 |
| Hugging Face | Hub API + Resolver | 🟢 5분 고정윈도우. Free 기준 API 1,000 / Resolver 5,000 / Pages 200, `HF_TOKEN` 전달 및 `RateLimit` 헤더 기반 retry |

> 🟢 arXiv/GitHub/HF rate limit은 공식 문서 기준으로 확인했다(2026-06-06). 구현 직전 수치 변경 여부만 재확인한다. SNS는 필수 수집 대상이므로 실제 계정 기반 Playwright 세션 검증·차단 대응을 구현 범위에 포함한다.

**저장 형식**: 텍스트=Markdown, 이미지/비디오=원본(MinIO), 메타데이터=OG·작성자·작성일·플랫폼.

### 5.5 수집처 관리 (F-15)
- 등록 소스 목록 / 마지막 수집 시각 / 상태(active/paused/failed) / 최근 수집 건수
- 일시중지·재개·편집·삭제
- ⚠️ **반복 실패 시 자동 일시중지 + 알림** (사이트 구조 변경 대응)
- 누구나 소스를 추가하므로 중복·방치 소스 누적 방지가 품질 핵심

### 5.6 안정성
- 모든 외부 호출: 타임아웃·지수 백오프·서킷브레이커
- rate limit 헤더 파싱 → 토큰버킷 동적 조정
- 실행 기록 `ingestion_runs`(§12), 관리자 대시보드(F-16) 노출
- 멱등성: url 유니크 + 새 항목만

---

## 6. 콘텐츠 처리 파이프라인 (LangGraph)

> 수동·자동 수집 모두 이 **단일 파이프라인**에 합류한다. v1.0 §4.1 흐름을 LangGraph로 구체화.

### 6.1 설계 근거 🟢
deep-research 검증: 우리 같은 **예측 가능한 다단계 콘텐츠 처리**는 자율 agent가 아니라 **워크플로우 패턴**(prompt chaining + orchestrator-worker)이 정답. (출처: LangGraph 공식 workflows-agents 문서)

### 6.2 그래프 정의
```
START (트리거: 신규 RawContent)
  ▼
① extract_content   크롤링 결과 → 본문(Markdown)·이미지 목록·메타 정규화
  ▼
② analyze_images    이미지별 캡션·OCR·차트/코드 인식 (§7) [orchestrator-worker: 이미지마다 워커]
  ▼
③ summarize         본문+이미지분석 통합 요약 + "왜 중요한가"
  ▼
④ classify_tag      카테고리 + 자동 태그(사용자 지정 + AI 추천)
  ▼
⑤ thumbnail         대표 썸네일 생성(Nanobanana Pro)
  ▼
⑥ embed             요약/본문 청크 임베딩 → pgvector
  ▼
⑦ index             전문검색 tsvector 갱신 + 검색 인덱싱
  ▼
⑧ (후속) graph_extract  엔티티·관계 추출 → Neo4j (§9)
  ▼
⑨ quality_gate ──(미달)──► ③ 재요약 (조건부 루프, 최대 N회)
  │
  ▼
END → 라이브러리 노출 + (자동수집이면) 출처 표시
```

### 6.3 구현 지침 🟢🟡
- 🟡 `StateGraph` + Pydantic State(`PipelineState`). 각 노드 순수 함수에 가깝게(TDD)
- 🟢 **structured output**: 요약·태깅·이미지분석은 Pydantic 스키마 기반 구조화 출력을 강제한다. OpenRouter 호출에서 structured output을 지원하면 사용하고, 미지원/실패 시 JSON schema 검증·재시도·fallback으로 보정한다. (파싱 에러·할루시네이션 표면적↓)
- 🟢 **durable execution**: LangGraph durability 모드(`exit`/`async`/`sync`). 비용 큰 노드(요약 후)는 `sync`에 가깝게
- 🟢 **Postgres checkpointer**(`AsyncPostgresSaver`): 노드 실패 시 마지막 성공 superstep부터 재개. ⚠️ resume는 **개발자가 같은 `thread_id`로 재호출**하는 방식 → Celery 재시도가 thread_id 보존하도록 설계
- 🟡 **LLM 비용 통제**: OpenRouter 모델별 가격·사용량을 기준으로 토큰·비용을 노드별 `pipeline_runs`에 기록한다. 초기 메인 모델은 `~anthropic/claude-sonnet-latest`이며, 관리자 설정(S-06)에서 OpenRouter 모델 ID를 변경할 수 있다.
- **실패 격리**: 한 콘텐츠 실패가 배치 전체를 막지 않음(개별 try/except + dead-letter)

### 6.4 AI 모델 설정·태깅 택소노미·재태깅 (G3·G8·F-05·F-25)
- 🟡 **AI 모델 설정 (G3)**: 초기 provider는 OpenRouter 단일이다. `AIModelProvider`는 OpenRouter 호환 클라이언트로 구현하고, 관리자 설정(S-06)에서 `base_url`, API key, 메인 LLM/Vision 모델 ID(`~anthropic/claude-sonnet-latest`)를 변경할 수 있다. 향후 provider 확장을 막지 않도록 인터페이스는 유지하되 현재 계약 enum은 `openrouter`로 고정한다.
- 🟡 **임베딩·리랭커 모델 설정**: 임베딩은 `Embedder`, 리랭커는 `Reranker` 인터페이스로 추상화한다. 초기 임베딩 모델은 `qwen/qwen3-embedding-8b`, 초기 dimension은 4096, 초기 리랭커 모델은 `cohere/rerank-4-fast`이다. 모델 자체는 32~4096 output dimension을 지원하므로 dimension을 변경할 수 있지만, 임베딩 모델 또는 차원이 변경되면 전체 콘텐츠 청크를 재임베딩하는 Celery 잡을 자동 생성하거나 관리자에게 실행을 요구한다.
- 🟡 **웹 검색 보강 설정**: `WebSearchProvider` 인터페이스로 추상화한다. 초기 provider는 Tavily 또는 동등한 Tavily-compatible 웹 검색 API이며, 관리자 설정 또는 환경변수로 provider/API key를 관리한다. 웹 검색은 §9.1의 콘텐츠 한정 챗봇 보강 정책에 따라 제한적으로 사용한다.
- **기존 태그 택소노미 매핑 (G8)**: ④classify_tag 노드는 신규 태그를 남발하지 않고 **기존 팀 태그 목록을 프롬프트에 주입해 우선 매핑**, 적절한 태그가 없을 때만 신규 태그 제안 → 태그 폭증 방지·일관성
- **벌크·소급 재태깅 (F-25)**: 태그 체계 변경 시 과거 콘텐츠를 일괄 재분류하는 Celery 잡. 범위(전체/필터) 선택, 진행 표시. (운영자, 화면설계 S-03)

### 6.5 콘텐츠 번역 (F-24·G4)
- 영어 중심 AI 자료를 사용자 언어(한↔영)로 **per-item 번역** 제공
- **온디맨드 + 캐시**: 상세에서 "번역 보기" 요청 시 번역 → `content_translations`(§12)에 캐시(재요청 비용 절감). 파이프라인 배치가 아니라 요청 시 처리
- 대상: 제목·요약(기본) / 본문(선택). `LLMProvider` 동일 추상화로 로컬/외부 선택
- (Folo "AI RSS Reader" 패턴, 부록 D)

---

## 7. 이미지 분석·OCR (F-04)

> v1.0 §3.1.4 계승. 본문 이미지를 분석해 이해도·검색성을 높인다.

### 7.1 처리 대상·내용
| 대상 | 처리 | 활용 |
|------|------|------|
| 삽입 이미지 | Vision AI 캡션 | 검색·요약 반영 |
| 인포그래픽·차트 | 데이터 시각화 해석 | 인사이트 추출 |
| 스크린샷·코드 이미지 | OCR + 코드 인식 | 전문 검색·복사 |
| 슬라이드/발표자료 | 캡션+OCR | 검색 |

### 7.2 저장 구조 (→ §12 `content_images`)
```
Content
├── raw_content (Markdown)
├── images[]
│   ├── original_url / local_path(MinIO)
│   ├── caption (AI 생성)
│   ├── ocr_text (추출 텍스트 → 검색 대상)
│   ├── image_type (photo/diagram/chart/screenshot/code/infographic)
│   └── analysis (JSON 상세)
```

### 7.3 파이프라인 통합
- §6 ②노드에서 이미지마다 워커로 병렬 처리(orchestrator-worker)
- OCR 텍스트는 §8 전문검색(`tsvector`)에 포함 → 이미지 속 텍스트도 검색됨
- 캡션은 요약(③)·임베딩(⑥) 입력에 포함 → 이미지 내용도 의미 검색·챗봇 대상

---

## 8. 검색 (Postgres 하이브리드)

> **[v1.0→v2.0]** Elasticsearch → **Postgres `tsvector` + pgvector 하이브리드**로 통일. 운영 단순성(별도 검색엔진 불필요)·트랜잭션 일관성이 사내 규모에 유리.

### 8.1 아키텍처: pgvector(HNSW) + BM25 + 한국어 검색 보강
🟡 현재 개발 범위는 Postgres 하나로 전문검색+벡터검색을 처리한다. 근거: 이미 Postgres가 메인 DB → 인프라·동기화 불필요, 메타+벡터 동일 트랜잭션.
- **전용 벡터DB/ES 전환 트리거** 🔴[실측 결정]: 검색 p95가 목표 지속 초과 + pgvector 튜닝(HNSW `m`/`ef_search`·iterative scan·quantization)으로 해결 불가 시. → `SearchBackend` 인터페이스로 교체 가능하게.

### 8.2 하이브리드 검색 (BM25 + 벡터 + RRF)
```
질의 "q"
 ├─► [키워드검색] BM25(+한국어 보강) ← 제목·본문·OCR 텍스트 포함  → 결과 A
 └─► [벡터검색] q 임베딩 → pgvector 코사인 top-k                 → 결과 B
            ▼
   [RRF] score(d)=Σ 1/(k+rank_i(d))  (k≈60)
            ▼
   [(선택) Reranker] 상위 N개 cross-encoder 재정렬
            ▼
        최종 결과
```
- 🟡 **RRF**: 스케일 다른 두 검색을 안전하게 융합(k=60 관행)
- **BM25**: 기본 키워드 랭킹은 BM25를 포함한다. Postgres 내 구현은 VectorChord-bm25 또는 동등한 Postgres BM25 확장을 우선 검토한다.
- **한국어 관련도 보강**: 한글/영문 혼합 쿼리 정규화, 공백·대소문자·기호 정규화, 동의어/약어 사전(예: LLM/대규모언어모델), 태그/카테고리 boost, OCR 텍스트 boost를 적용한다. Postgres 확장은 한국어 검색 품질 실측 후 PGroonga/pg_bigm/동등 확장을 선택한다.
- **Reranking**: RRF로 합친 상위 후보를 `cohere/rerank-4-fast`로 재정렬한다. OpenRouter 장애·예산 초과·rate limit 시 RRF 결과를 fallback으로 반환하고 실패 로그를 남긴다.

### 8.3 임베딩 전략 🟡
- **모델**: 초기값은 OpenRouter `qwen/qwen3-embedding-8b`. OpenRouter 모델 페이지 기준 text input→embeddings output, 32K context, $0.01/M input tokens. Hugging Face 모델 카드 기준 embedding dimension은 최대/초기 **4096**이며, 사용자 정의 output dimension은 32~4096 범위를 지원한다. 실제 사용 dimension은 `model_version`과 함께 저장한다.
- **대상**: 콘텐츠 제목+요약(+긴 본문은 청크). 이미지 캡션·OCR도 포함
- **인덱스**: pgvector HNSW(`vector_cosine_ops`), 파라미터 튜닝
- **모델 변경 처리**: 임베딩 provider/model/dimension이 변경되면 기존 embedding은 같은 인덱스에서 재사용하지 않는다. 전체 콘텐츠 청크를 재임베딩하고 새 `model_version`으로 인덱싱한 뒤 검색 설정을 전환한다. 재임베딩 진행률은 관리자 대시보드에 표시한다.

### 8.4 필터·소비 (F-07)
- 태그 필터, **카테고리 필터**(`model_release`·`paper`·`tool`·`benchmark`·`opinion` 등 AI 프리셋 포함), 기간 필터(작성일/수집일), 플랫폼·소스 필터
- 읽음/안읽음(개인별, 타인 비공개), 북마크(개인별 즐겨찾기)
- OCR 텍스트도 검색 대상
- **글로벌 검색바**(헤더, 단축키 Cmd/Ctrl+K) + 실시간 자동완성(300ms 디바운스)·최근 검색어 — UX 상세는 화면설계 §6.4

### 8.5 탐색 (F-12)
> 검색이 "찾기"라면 탐색은 "둘러보기". 라이브러리를 다른 축으로 브라우징.
- **태그별(E-01)**: 태그 목록·콘텐츠 수 → 클릭 시 해당 태그 필터 라이브러리. 태그 클릭은 전역 동작(§화면설계 6.2)
- **플랫폼별(E-02)**: YouTube/X/블로그 등 플랫폼별 묶음 보기
- **타임라인(E-03)**: 수집·작성 시간축 보기
- **카테고리별(E-04)**: AI 프리셋 카테고리(`model_release`·`paper`·`tool`·`benchmark`·`opinion`)와 팀 커스텀 카테고리를 카드/칩 묶음으로 탐색. 카테고리 클릭 시 해당 `category` 필터가 적용된 라이브러리로 이동
- 구현: 기존 `/contents` 필터 API 재사용(`?tag=`·`?platform=`·`?category=`·기간). 탐색은 별도 화면이되 데이터는 동일 소스

> 화면설계 반영 위치: L-01 카테고리 필터·`CategoryChip`, E-04 카테고리 탐색, 콘텐츠 카드·상세 카테고리 배지.

### 8.6 하이라이트·주석 + 읽기 위치 보존 (F-22·G5)
> Omnivore 패턴(부록 D). 콘텐츠 상세(L-02)에서 깊이 읽고 다시 찾는 워크플로 지원.
- **하이라이트·주석**: 본문 텍스트 선택 → 형광펜(색상) + 주석 입력. 개인별(`highlights` 테이블 §12). 상세 사이드에 하이라이트 목록, 검색 대상 포함(선택)
- **읽기 위치 보존**: 콘텐츠 상세를 다시 열면 마지막으로 읽던 스크롤 위치 복원(`read_status.scroll_position` §12). 긴 글 이어 읽기
- AC: 선택→하이라이트→주석, 하이라이트 목록·삭제, 재방문 시 위치 복원. 하이라이트/주석은 타인 비공개(개인별)

---

## 9. Graph RAG 챗봇 (Neo4j — 후속 단계)

> **[v1.0→v2.0]** v1.0의 Graph RAG는 **후속 단계로 분리**한다(F-19). **현재 개발 범위는 하이브리드 검색 기반 일반 RAG**로 시작하고, 관계형 질의 수요가 확인되면 Neo4j Graph RAG로 강화한다.

### 9.1 현재 RAG (하이브리드 검색 기반) — F-10
- "지난달 저장한 RAG 글 요약해줘" → §8 하이브리드 검색으로 근거 retrieve → LLM이 **출처 인용과 함께** 답변
- **할루시네이션 방지**: retrieve 근거 내에서만 답변, 주장마다 출처 콘텐츠 링크, 근거 없으면 "정보 없음"
- LangGraph RAG는 단순한 `retrieve(search) → generate_with_citations` 흐름으로 구현한다. 이전 검색 기록 재조회, 대화 메모리, thread별 장기 상태는 사용하지 않는다.
- 요청 상태는 응답 완료 후 휘발된다. 보존 대상은 운영 로그(`pipeline_runs`/LLM 비용), 질문·답변 감사 로그(설정 시), 출처 citation뿐이다.
- **전역 챗봇(`scope=global`)**: 전체 저장 콘텐츠를 대상으로 하이브리드 검색 → 답변한다. 출처는 저장 콘텐츠 citation으로 표시한다.
- **콘텐츠 한정 챗봇(`scope=current_content`)**: 현재 보고 있는 콘텐츠(`content_id`)의 제목·요약·본문·이미지 캡션·OCR을 1차 근거로 사용한다. 화면은 콘텐츠 상세 우측 SlidePanel에서 제공한다.
- **콘텐츠 한정 답변 정책**:
  1. 먼저 질문이 현재 문서와 관련 있는지 판정한다.
  2. 관련 없는 질문이면 외부 검색을 하지 않고 `이 질문은 현재 문서와 관련이 없습니다.`라고 답한다. 응답 `answer_mode=unrelated_to_content`.
  3. 관련 있고 본문 근거가 충분하면 현재 문서만으로 답한다. 응답 `answer_mode=content_grounded`, citation `source_type=content`.
  4. 관련 있지만 본문 근거가 부족하고 `external_search_mode=auto|force`이면 `WebSearchProvider`(초기 Tavily 또는 동등 API)로 외부 검색을 수행해 보강한다. 답변에는 `본문에는 충분한 정보가 없어 외부 검색으로 보강했습니다.`를 표시하고, citation은 `source_type=content|web`으로 분리한다. 응답 `answer_mode=web_augmented`.
  5. 관련 있지만 본문 근거가 부족하고 외부 검색이 꺼져 있으면 `현재 문서만으로는 답변할 정보가 충분하지 않습니다.`라고 답한다. 응답 `answer_mode=insufficient_content`.
- **외부 검색 제한**: 외부 검색은 콘텐츠 한정 챗봇에서 “현재 문서와 관련 있음”으로 판정된 질문에만 사용한다. 무관 질문에는 검색하지 않는다.
- **화면 표시**: 콘텐츠 챗봇 답변에는 `본문 기반`, `외부 검색 보강`, `관련 없음` 상태 배지를 표시한다. 외부 검색 보강 시 내부 콘텐츠 출처와 외부 웹 출처를 분리해 보여준다.

### 9.2 후속 Graph RAG (Neo4j) — F-19
- §6 ⑧노드(graph_extract)에서 엔티티(person/technology/company/concept)·관계 추출 → Neo4j 적재
- 멀티홉 질의("X와 Y의 관계는?", "X를 언급한 모든 글은?")에 강함
- 도입 판단 기준 🔴: 현재 RAG로 충족 안 되는 **관계형/멀티홉 질의 수요**가 베타에서 확인될 때. (부록 B 비교표)

### 9.3 예시 질문
- "최근 AI Agent 관련 트렌드는?" · "LangChain vs LlamaIndex 비교 콘텐츠 찾아줘"
- "지난달 저장한 RAG 글 요약해줘" · "아키텍처 다이어그램 포함 글 찾아줘"(← 이미지 분석 덕분)

---

## 10. 다이제스트 (F-08)

> v1.0 §3.1.8 계승. **주간 다이제스트가 핵심.** AI 추천 → 사람 큐레이션 → 확정·공개 공유.

### 10.1 생성·큐레이션 흐름
```
[Celery Beat 주간/일간] → 기간 콘텐츠 집계
  → AI 후보 추천(중요도·트렌드 기반, 초안 생성)
  → 사용자 검토·편집(포함/제외·순서·코멘트)
  → 확정(배포) → 공개 공유 링크 생성(추측 불가 토큰)
  → Google Chat 알림(§11)
```
- LangGraph 서브그래프: select_candidates → rank → compose(LLM 편집·주제 그룹핑) → critique/polish → (사용자 확정 후) publish
- 트렌드 분석·주요 토픽 추출, 대표 이미지 생성(Nanobanana Pro)

### 10.2 공개 공유
- 배포 시 **추측 불가 토큰 URL**(`/share/:token`) 자동 생성, 링크 복사로 외부 공유
- 공개 뷰는 **로그인 없이 읽기 전용** 열람
- 상태: `draft`(AI 추천) → `published`(배포)
- ⚠️ 보안: 추측 불가 토큰, 읽기 전용·최소 정보, 필요 시 링크 비활성화(§23)

### 10.3 아카이브
- 과거 다이제스트를 날짜별로 열람(`/digests`)

---

## 11. 알림 (F-14)

> v1.0 §3.1.9 계승 + G6(Miniflux 패턴) 반영. 최소 알림으로 노이즈 방지.
- **다이제스트 배포(published) 시 알림** 전송
- **다중 채널 (G6)**: `Notifier` 인터페이스로 추상화해 **Google Chat·Slack·범용 Webhook** 지원. 팀마다 쓰는 채널이 다르므로 설정에서 채널·대상 선택(화면설계 S-02)
- **Webhook**: 다이제스트 배포·(옵션)신규 수집 이벤트를 팀이 지정한 URL로 POST → 사내 자동화·커스텀 통합. 서명·재시도
- 자동 수집 소스 반복 실패 시 운영자 알림(§5.5)

---

## 12. 데이터 모델

> **[v1.0→v2.0]** v1.0 §9 엔티티를 **Postgres DDL로 구체화** + pgvector·tsvector·자동수집·멀티팀 반영. Graph(Neo4j) 스키마는 §9.2/부록 B.

### 12.1 ERD (개념)
```
 orgs(팀) 1─N users ─┬─N contents ─┬─1:1 content_embeddings (pgvector)
                     │             ├─N content_images
                     │             ├─N content_tags ─N tags
                     │             ├─N read_status (user별)
                     │             └─N bookmarks (user별)
                     │
 collection_sources 1─N contents (자동수집 출처)
 digests 1─N digest_contents N─1 contents
 [운영] ingestion_runs · pipeline_runs
```
> 콘텐츠는 팀/전사 공유(읽음·북마크만 user별). 멀티팀은 `org_id`로 구분(§16).

### 12.2 DDL (Postgres)
> 컨벤션: `id UUID PK DEFAULT gen_random_uuid()`, `created_at`/`updated_at timestamptz`. Alembic 마이그레이션.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- 팀(조직)
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  org_id UUID REFERENCES orgs(id),
  role TEXT NOT NULL DEFAULT 'member',   -- 'member'|'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 수집처(자동 수집 소스)
CREATE TABLE collection_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL,             -- 'rss'|'account'|'webpage'
  extract_scope TEXT NOT NULL DEFAULT 'full',  -- 'full'|'summary'|'region'
  crawl_depth INT NOT NULL DEFAULT 0,
  auto_tags JSONB NOT NULL DEFAULT '[]',
  schedule_interval TEXT NOT NULL DEFAULT 'daily', -- 'hourly'|'daily'|'custom:<cron>'
  status TEXT NOT NULL DEFAULT 'active', -- 'active'|'paused'|'failed'
  last_collected_at TIMESTAMPTZ,
  last_run_status TEXT,
  last_run_item_count INT,
  fail_count INT NOT NULL DEFAULT 0,     -- 반복 실패 자동 일시중지용
  created_by UUID REFERENCES users(id),
  org_id UUID REFERENCES orgs(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 콘텐츠
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  url_hash TEXT NOT NULL,                -- 정규화 URL 해시(중복 방지)
  title TEXT NOT NULL,
  platform TEXT NOT NULL,                -- 'web'|'youtube'|'x'|'facebook'|'linkedin'|'threads'|'reddit'|'email'|'arxiv'|'github'|'hf'
  original_created_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_content TEXT,                      -- Markdown 본문
  summary TEXT,
  why_matters TEXT,
  thumbnail_url TEXT,
  author TEXT,
  og_metadata JSONB NOT NULL DEFAULT '{}',
  crawl_depth INT NOT NULL DEFAULT 0,
  reading_time INT,                      -- 예상 읽기 시간(분)
  note TEXT,                             -- 수집 시 사용자 메모 (F-13, 링크 추가 모달)
  category TEXT,                         -- 'model_release'|'paper'|'tool'|'opinion'|'benchmark'|...
  collected_by UUID REFERENCES users(id),
  source_id UUID REFERENCES collection_sources(id), -- 자동수집 출처(수동이면 NULL)
  org_id UUID REFERENCES orgs(id),
  tsv TSVECTOR,                          -- 제목+본문+요약+OCR 텍스트(트리거 갱신)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (url_hash)
);
CREATE INDEX idx_contents_tsv ON contents USING GIN (tsv);
CREATE INDEX idx_contents_platform ON contents (platform);
CREATE INDEX idx_contents_collected ON contents (collected_at DESC);
CREATE INDEX idx_contents_category ON contents (category);

-- 임베딩 (pgvector)
CREATE TABLE content_embeddings (
  content_id UUID PRIMARY KEY REFERENCES contents(id) ON DELETE CASCADE,
  embedding vector(4096),                -- Qwen3-Embedding-8B 초기 dimension
  model_version TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'openrouter',
  dimension INT NOT NULL DEFAULT 4096,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_emb_hnsw ON content_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- 전체 재임베딩 잡(임베딩 모델/차원 변경 시)
CREATE TABLE embedding_reindex_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_provider TEXT,
  from_model_version TEXT,
  to_provider TEXT NOT NULL,
  to_model_version TEXT NOT NULL,
  to_dimension INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued'|'running'|'success'|'failed'
  total_count INT DEFAULT 0,
  processed_count INT DEFAULT 0,
  error TEXT,
  created_by UUID REFERENCES users(id),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 콘텐츠 이미지(분석·OCR)
CREATE TABLE content_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  original_url TEXT,
  local_path TEXT,                       -- MinIO 경로
  caption TEXT,                          -- AI 생성 캡션
  ocr_text TEXT,                         -- 추출 텍스트(검색 대상)
  analysis JSONB,                        -- 상세 분석
  image_type TEXT,                       -- 'photo'|'diagram'|'chart'|'screenshot'|'code'|'infographic'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_images_content ON content_images (content_id);

-- 태그
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  is_auto_generated BOOLEAN NOT NULL DEFAULT false
);
CREATE TABLE content_tags (
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- 읽음 상태(개인별) + 읽기 위치 보존(F-22/G5)
CREATE TABLE read_status (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  scroll_position INT,                   -- 마지막 읽던 위치(px 또는 % ) 복원용
  PRIMARY KEY (user_id, content_id)
);

-- 하이라이트·주석(개인별, F-22/G5)
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,                   -- 선택된 본문 텍스트
  range_info JSONB,                      -- 위치(문자 오프셋/DOM range 등)
  note TEXT,                             -- 주석(선택)
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_highlights_user_content ON highlights (user_id, content_id);

-- 콘텐츠 번역 캐시(F-24/G4)
CREATE TABLE content_translations (
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  lang TEXT NOT NULL,                    -- 'ko'|'en'
  translated_title TEXT,
  translated_summary TEXT,
  translated_body TEXT,                  -- 본문 번역(선택)
  model_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (content_id, lang)
);

-- 웹훅/알림 채널 설정(F-14/G6)
CREATE TABLE notification_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                    -- 'google_chat'|'slack'|'webhook'
  config JSONB NOT NULL,                 -- {webhook_url, secret, events:[...]}
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 북마크(개인별)
CREATE TABLE bookmarks (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, content_id)
);

-- 다이제스트
CREATE TABLE digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,                    -- 'daily'|'weekly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  summary TEXT,
  trending_topics JSONB,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',  -- 'draft'|'published'
  share_token TEXT UNIQUE,               -- 공개 공유용 추측 불가 토큰
  is_public BOOLEAN NOT NULL DEFAULT false,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  curated_by UUID REFERENCES users(id),
  org_id UUID REFERENCES orgs(id)
);
CREATE TABLE digest_contents (
  digest_id UUID REFERENCES digests(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id),
  position INT,
  is_ai_recommended BOOLEAN NOT NULL DEFAULT true,
  editorial_note TEXT,
  PRIMARY KEY (digest_id, content_id)
);

-- 운영 관측성
CREATE TABLE ingestion_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES collection_sources(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL,                  -- 'running'|'success'|'failed'
  items_fetched INT DEFAULT 0,
  items_new INT DEFAULT 0,
  error TEXT
);
CREATE TABLE pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES contents(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  llm_tokens INT DEFAULT 0,
  llm_cost_usd NUMERIC(10,4) DEFAULT 0,
  error TEXT
);
```

### 12.3 지식 그래프 스키마 (Neo4j — 후속 §9.2)
```
노드: (:Content{id,title,url,platform,collected_at}) (:Entity{name,type}) (:Tag{name}) (:User{id,name})
관계: (:Content)-[:MENTIONS]->(:Entity)  (:Content)-[:TAGGED_WITH]->(:Tag)
      (:Content)-[:RELATED_TO]->(:Content)  (:Content)-[:COLLECTED_BY]->(:User)
      (:Entity)-[:RELATED_TO]->(:Entity)
```

### 12.4 마이그레이션·내보내기
- Alembic 버전 관리(마이그레이션+롤백), pgvector 확장은 첫 마이그레이션
- **Export(F-17)**: 콘텐츠·태그·다이제스트를 **JSON/CSV/Markdown**으로 내보내기(화면설계 S-05). 범위 선택(전체/필터). 백업 정책(일일 백업 + 이중화 고려)

---

## 13. API 설계 (FastAPI)

### 13.1 원칙
- REST+JSON, 리소스 중심, 버전 프리픽스 `/api/v1`. Pydantic v2 → OpenAPI 자동 생성
- **API 계약의 단일 진실(SoT)은 `openapi/infosnack-api.yaml`(OpenAPI 3.1)**이다. PRD의 엔드포인트 표는 요약이며, 실제 request/response schema·상태코드·권한·예시는 OpenAPI 문서를 따른다.
- **모든 기능은 API로 수행 가능해야 한다.** 화면에 출력되는 모든 동적 데이터, 화면에서 발생하는 모든 액션, 브라우저 확장·모바일 공유·자동수집·다이제스트 배포·관리자 재처리·설정·내보내기는 API 계약에 포함한다.
- Next.js가 BFF 역할을 하더라도 BFF는 OpenAPI 계약을 기준으로 백엔드를 호출하거나 같은 응답 형태를 노출한다. 프론트는 OpenAPI schema에서 생성한 타입을 사용하고 임의 응답 구조를 가정하지 않는다.
- 인증: NextAuth.js(프론트) ↔ 백엔드 JWT 검증, 보호 엔드포인트 `Depends(get_current_user)`. 공개 공유(`/share/{token}`)와 헬스체크는 비인증.
- cursor 페이지네이션은 `CursorPage*` 공통 schema를 사용한다. 목록 API는 `items`, `next_cursor`, `has_more`를 반환한다.
- 표준 에러는 `ErrorResponse` schema를 사용한다. 기본 형태: `{ "error": {"code","message","details","request_id"} }`
- 챗봇 스트리밍은 `text/event-stream`으로 명시하고, 이벤트 타입은 `metadata`, `delta`, `citation`, `done`, `error`로 고정한다. `metadata`에는 `scope`, `relevance_status`, `answer_mode`, `external_search_used`를 포함한다.
- Webhook 송신 payload는 OpenAPI 3.1 `webhooks` 섹션에 정의한다. Google Chat·Slack·커스텀 Webhook 모두 같은 내부 이벤트 모델에서 변환한다.

### 13.2 공통 API 계약
| 항목 | 계약 |
|------|------|
| Spec 파일 | `openapi/infosnack-api.yaml` |
| OpenAPI 버전 | `3.1.0` |
| Base URL | `/api/v1` |
| 인증 | Bearer JWT (`bearerAuth`) |
| 공개 예외 | `GET /share/{token}`, `GET /health` |
| 페이지네이션 | cursor 방식: `cursor`, `limit` 요청 → `items`, `next_cursor`, `has_more` 응답 |
| 표준 에러 | `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`은 `ErrorResponse` |
| 권한 | `member` 기본, 관리자 API는 `admin` role 필요 |
| 스트리밍 | `POST /chat/ask`는 `application/json` 또는 `text/event-stream` |
| 웹훅 | `digest.published`, `source.failed`, `pipeline.failed`, `cost.threshold_exceeded` |
| 계약 검증 | CI에서 OpenAPI lint + Schemathesis 계약 테스트 실행 |

### 13.3 엔드포인트 요약
**수집·콘텐츠**
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/capture` | 수동 수집(브라우저확장·공유시트·링크 모달). body `{url, selection?, note?, tags?, depth?}` → 처리 큐 적재 |
| GET | `/dashboard` | 홈 대시보드(F-11) 집계. 이번 주 수집 수·읽지 않음 수·트렌드 태그·최근/읽지않은 콘텐츠·최신 다이제스트 |
| GET | `/contents` | 라이브러리 목록. `?platform=&tag=&category=&from=&to=&read=&bookmarked=&q=&cursor=&limit=` |
| PATCH | `/contents/{id}` | 메모(note)·태그 수정 |
| GET | `/contents/{id}` | 콘텐츠 상세(본문·요약·이미지분석·태그·메타) |
| DELETE | `/contents/{id}` | 삭제(권한 체크) |
| POST | `/contents/{id}/read` | 읽음 토글 + 읽기 위치 저장(`{scroll_position}`, F-22) |
| POST/DELETE | `/contents/{id}/bookmark` | 북마크 토글 |
| GET/POST | `/contents/{id}/highlights` | 하이라이트·주석 목록 / 추가(F-22). `{quote, range_info, note?, color?}` |
| DELETE | `/highlights/{id}` | 하이라이트 삭제 |
| GET | `/contents/{id}/translate` | 콘텐츠 번역(F-24). `?lang=ko\|en&scope=summary\|body` → 캐시 우선 |
| GET/POST | `/tags` | 태그 목록·카운트 / 태그 생성 |
| PATCH/DELETE | `/tags/{id}` | 태그 수정 / 삭제 |

**자동 수집(수집처)**
| POST | `/sources/preview` | 등록 전 1회 시범 수집 미리보기. body `{url}` → 감지 종류+샘플 |
| GET/POST | `/sources` | 수집처 목록 / 등록 |
| PATCH/DELETE | `/sources/{id}` | 편집(주기·옵션·태그) / 삭제 |
| POST | `/sources/{id}/pause` · `/resume` | 일시중지·재개 |

**검색·챗봇**
| GET | `/search` | 하이브리드 검색. `?q=&platform=&tag=&category=&from=&to=&mode=hybrid\|keyword\|semantic` |
| POST | `/chat/ask` | RAG 질의응답. body `{question, scope, filters?, content_id?, external_search_mode?}` → `{answer, relevance_status, answer_mode, external_search_used, citations[]}` (스트리밍) |

**다이제스트**
| GET/POST | `/digests` | 목록(아카이브) / 생성(수동 트리거) |
| GET | `/digests/{id}` | 상세(편집용) |
| PATCH | `/digests/{id}` | 큐레이션(포함/제외·순서·코멘트) |
| POST | `/digests/{id}/publish` | 확정·배포(공유 토큰 생성 + 알림) |
| GET | `/share/{token}` | **공개 공유 뷰(비인증 읽기전용)** |

**사용자·팀·관리자**
| GET | `/me` | 내 프로필·팀 |
| PATCH | `/me/prefs` | 관심사·언어 |
| PATCH | `/me/profile` | 이름·프로필 이미지 등 프로필 수정 |
| GET/PATCH | `/me/theme` | 테마 설정 조회 / 수정 |
| POST | `/settings/export` | 데이터 내보내기 작업 생성(JSON/CSV/Markdown) |
| GET | `/admin/sources`·`/ingestion-runs`·`/pipeline-runs` | 운영 모니터링(admin) |
| POST | `/admin/pipeline/retrigger` | 실패 콘텐츠 재처리 |
| POST | `/admin/retag` | 벌크·소급 AI 재태깅 잡 실행(F-25). `{scope, filter?}` |
| GET/PATCH | `/admin/ai-engine` | OpenRouter 기반 메인 LLM/Vision·임베딩·리랭커 모델 설정 |
| GET/PATCH | `/admin/embedding-engine` | OpenRouter 임베딩 model/dimension 설정 |
| POST | `/admin/embeddings/reindex` | 임베딩 모델 변경 후 전체 콘텐츠 재임베딩 잡 실행 |
| GET | `/admin/orgs`·`/users` | 팀·사용자 관리(admin) |
| GET/POST/DELETE | `/settings/notification-channels` | 알림·웹훅 채널(Google Chat/Slack/Webhook, F-14) |

**시스템**: `GET /health`(DB·Redis·MinIO·외부 의존), `GET /api/v1/openapi.json`

### 13.4 응답 예시
```jsonc
// GET /api/v1/contents/{id}
{
  "id":"uuid","title":"...","url":"https://...","platform":"youtube",
  "summary":"...","why_matters":"...","category":"tool",
  "tags":["rag","agent"],"thumbnail_url":"https://minio/...",
  "images":[{"caption":"아키텍처 다이어그램","ocr_text":"...","image_type":"diagram"}],
  "author":"...","original_created_at":"...","collected_at":"...",
  "source":{"id":"uuid","name":"OpenAI Blog"}  // 자동수집이면
}
```

### 13.5 구현·테스트 지침
- FastAPI 구현 시 Pydantic schema 이름은 OpenAPI `components.schemas`와 맞춘다.
- OpenAPI에서 생성한 TypeScript 타입을 프론트/BFF에서 사용한다.
- PRD에 새 기능이나 화면 액션이 추가되면 OpenAPI path/schema를 먼저 추가한 뒤 구현한다.
- Schemathesis로 OpenAPI 계약 기반 API 테스트를 실행한다.
- breaking change는 CI에서 차단한다. 필드 삭제·타입 변경·상태코드 제거는 breaking change로 본다.

---

## 14. 프론트엔드 설계

> **화면 상세(UI/UX·와이어프레임·인터랙션·반응형·다크모드·로딩/에러)의 단일 진실(SoT)은 `InfoSnack_화면설계.md`다.** 본 절은 화면 상세를 중복하지 않고 **프론트 기술 아키텍처(라우팅·Next.js 16 패턴·상태관리·API 연동)**와 **화면설계와의 매핑**만 다룬다. 화면별 구체 레이아웃은 화면설계 문서의 화면 ID(H-01, L-01 등)를 참조.

### 14.1 라우팅 ↔ 화면설계 매핑 (Next.js 16 App Router)
> 화면 ID는 `InfoSnack_화면설계.md §3.2 / §4` 기준.

```
app/
├── (auth)/
│   ├── login/page.tsx                    # 로그인              → A-01
│   └── signup/page.tsx                   # 회원가입(초대 기반) → A-02
├── (app)/
│   ├── page.tsx                          # 홈·대시보드        → H-01
│   ├── library/page.tsx                  # 라이브러리 목록    → L-01
│   ├── library/[id]/page.tsx             # 콘텐츠 상세        → L-02 (+ SlidePanel 콘텐츠 챗봇)
│   ├── explore/tags/page.tsx             # 탐색-태그          → E-01
│   ├── explore/platforms/page.tsx        # 탐색-플랫폼        → E-02
│   ├── explore/timeline/page.tsx         # 탐색-타임라인      → E-03
│   ├── explore/categories/page.tsx       # 탐색-카테고리      → E-04
│   ├── chat/page.tsx                      # AI 챗봇 전역       → C-01
│   ├── digest/page.tsx                   # 다이제스트 목록    → D-01
│   ├── digest/[id]/page.tsx              # 다이제스트 상세    → D-02
│   ├── digest/[id]/edit/page.tsx         # 큐레이션 편집      → D-03
│   ├── sources/page.tsx                  # 수집처 관리        → AC-01
│   ├── sources/new/page.tsx              # 수집처 추가(계층형)→ AC-02
│   ├── sources/[id]/page.tsx             # 수집처 상세/편집   → AC-03
│   ├── insights/page.tsx                 # 인사이트(후속)     → I-01 (F-21)
│   └── settings/{profile,notifications,tags,theme,export,ai-engine}/page.tsx  # 설정 → S-01~06
├── (admin)/admin/page.tsx                # 운영 모니터링 F-16
├── share/[token]/page.tsx                # 공개 다이제스트(비인증) → P-01
└── layout.tsx                            # 헤더·사이드바·테마·i18n·인증 provider
```
> 라우트 경로는 화면설계 §3.2 기준(`/library/:id`, `/digest`, `/explore/*`, `/settings/*`). 검색은 별도 페이지가 아니라 **라이브러리(L-01) 통합 + 헤더 글로벌 검색**(화면설계 §6.4). 링크 추가는 **모달 H-02**(전역). 차이가 생기면 **화면설계.md를 우선**한다.

### 14.2 최신 패턴 🟢 (3차 deep-research 검증)
- **Next.js 16 Cache Components/PPR**: 제품 기능이 아니라 렌더링 방식이다. `use cache` 대상은 레이아웃·사이드바·헤더 같은 정적 셸, `<Suspense>` 대상은 목록·검색·상세·관리자 데이터처럼 요청 시점에 바뀌는 동적 영역으로 분리한다.
- **TanStack Query + RSC**: 서버는 **요청당 새 QueryClient**(누수 방지), 클라는 싱글톤. Server Component에서 `prefetchQuery()` → `<HydrationBoundary>`로 전달. (실험적 스트리밍 하이드레이션 패키지는 현재 개발 범위에서 미사용)
- **bun**: 패키지매니저·로컬 런타임. ⚠️ 배포 환경에 따라 런타임 결정(O-03)

### 14.3 상태관리
- 서버 상태 = **TanStack Query**(목록·검색·상세·다이제스트, 무한스크롤=`useInfiniteQuery`, 낙관적 업데이트=북마크/읽음)
- 클라이언트 상태 = **Zustand**(세션·UI: 필터·테마·사이드바 접힘 상태(화면설계 §2.3)·챗봇 SlidePanel 열림)

### 14.4 공통 컴포넌트 (화면설계 §5 참조)
화면설계가 정의한 공통 컴포넌트를 shadcn/ui 기반으로 구현. 핵심: **ContentCard**(라이브러리 카드, 화면설계 §5.2), **SlidePanel**(콘텐츠 한정 챗봇, §5.3). 전체 목록·props는 화면설계 §5.1을 SoT로.

### 14.5 화면별 데이터 연동 (화면 ID → API)
> 세부 request/response 계약은 `openapi/infosnack-api.yaml`을 따른다.

| 화면 ID | 화면 | 주요 API(§13) |
|---------|------|--------------|
| H-01 | 홈·대시보드 | `/dashboard` |
| L-01 | 라이브러리 목록 | `/contents`(+필터)·`/search` |
| L-02 | 콘텐츠 상세 | `/contents/{id}`·`PATCH /contents/{id}`(메모/태그)·`/contents/{id}/read`·`/contents/{id}/bookmark`·`/contents/{id}/highlights`·`/contents/{id}/translate`·`/chat/ask`(content_id) |
| E-01~04 | 탐색(태그/플랫폼/타임라인/카테고리) | `/contents`(`?tag=`·`?platform=`·`?category=`·기간) |
| C-01 | 전역 챗봇 | `/chat/ask` |
| D-01/02 | 다이제스트 목록·상세 | `/digests`·`/digests/{id}` |
| D-03 | 큐레이션 편집 | `PATCH /digests/{id}`·`/publish` |
| P-01 | 공개 공유 | `GET /share/{token}` (비인증) |
| AC-01/02/03 | 수집처 관리·추가·상세 | `/sources`·`/sources/preview`·`/sources/{id}`·`/sources/{id}/pause`·`/sources/{id}/resume` |
| S-01 | 설정-프로필 | `/me`·`/me/profile`·`/me/prefs`(언어) |
| S-02 | 설정-알림 | `/settings/notification-channels` |
| S-03 | 설정-태그 관리 | `/tags`·`/tags/{id}`·`/admin/retag` |
| S-04 | 설정-테마 | `/me/theme` |
| S-05 | 설정-데이터 내보내기 | `/settings/export` |
| S-06 | 설정-AI 엔진(admin) | `/admin/ai-engine`·`/admin/embedding-engine`·`/admin/embeddings/reindex` |
| AD-01 | 관리자 운영 대시보드 | `/admin/sources`·`/admin/ingestion-runs`·`/admin/pipeline-runs`·`/admin/pipeline/retrigger`·`/admin/orgs`·`/users` |

### 14.6 UI 원칙 (요약 — 상세는 화면설계 §1·§7·§8·§9)
- shadcn/ui + Tailwind 토큰(§1.4 브랜드 컬러), **다크모드 기본**, Lucide, Framer Motion
- 반응형(화면설계 §7 브레이크포인트), 접근성(키보드·ARIA·대비, §10 단축키)
- 로딩=스켈레톤, 빈/에러 상태(화면설계 §9), i18n 한/영(next-intl)
- Sentry 에러·행동 이벤트 수집(§22 지표 측정)

---

## 15. 브라우저 확장 (Plasmo)

> v1.0 계승. Chrome/Safari 확장으로 "발견 → 즉시 저장" 마찰 최소화.
- **Plasmo**(React 기반) 익스텐션. 팝업/컨텍스트 메뉴에서 현재 페이지 저장
- 동작: 현재 URL + 선택 텍스트 + (선택)태그 → `POST /capture` → 저장 피드백
- 인증: 웹 세션 토큰 공유(또는 확장 전용 토큰). 로그인 상태 연동
- AC: 2클릭 내 저장, 저장 결과 토스트, 중복이면 "이미 저장됨" 표시

---

## 16. 인증·권한·멀티팀

### 16.1 인증
- **NextAuth.js v5(Auth.js)** — 현재 개발 범위는 **이메일 기반 초대 가입/로그인**이다. 관리자가 사용자를 초대하면 초대 이메일의 토큰 링크로 가입한다.
- Google Workspace OIDC 등 사내 SSO는 후속 확장으로 고려하되, 사용자 테이블·세션 구조는 SSO 도입이 가능하도록 `email`, `org_id`, `role`, provider 식별자를 수용할 수 있게 설계한다.
- 세션: JWT(access 단명) + refresh(httpOnly·Secure 쿠키, 로테이션). 백엔드는 JWT 검증
- 비밀번호 사용 시 Argon2/bcrypt. 인증 엔드포인트 레이트리밋(brute-force 방어)

### 16.2 권한·멀티팀
- 역할: `member` / `admin`. admin은 수집처·파이프라인·팀/사용자 관리(F-16)
- 멀티팀: `org_id`로 구분하되, **현재 개발 범위는 전체 공유 + 팀 필터 제공**이다. 완전 격리는 적용하지 않는다.
- 후속으로 `org_id` 기준 부분 격리와 개인 라이브러리 ↔ 팀 공유 라이브러리 분리를 도입할 수 있도록 모든 주요 테이블에는 `org_id`/`created_by`/user별 상태(`read_status`, `bookmarks`, `highlights`)를 유지한다.
- **공개 공유 다이제스트**(`/share/:token`)는 비인증 읽기전용 — 추측 불가 토큰, 최소 정보 노출(§10.2)

### 16.3 프라이버시·보안
- 읽음/북마크는 개인별·타인 비공개
- 민감정보(토큰·세션) 로깅 금지(Sentry 스크러빙)

---

## 17. 시스템 아키텍처

> **[v1.0→v2.0]** 데이터 레이어를 Postgres(pgvector 포함) 중심으로 단순화. Elasticsearch·별도 벡터DB 제거, Neo4j는 후속 단계로 분리.

```
┌──────────────────────────── 클라이언트 ────────────────────────────┐
│ 웹 앱(Next.js 16)   │ 브라우저 확장(Plasmo)  │ 모바일 공유시트       │
└─────────┬───────────────────┬──────────────────────┬───────────────┘
          ▼                   ▼                      ▼
┌────────────────────────────────────────────────────────────────────┐
│                    API 레이어 (FastAPI + 인증)                       │
│            + 공개 공유 다이제스트(비인증 읽기전용)                    │
└───────────────┬───────────────────────────────┬────────────────────┘
                ▼                               ▼
       ┌────────────────┐              ┌─────────────────────┐
       │ 워커(Celery)   │              │ RAG 챗봇 서비스      │
       ├────────────────┤              │ (하이브리드검색+LLM) │
       │ • 크롤링       │              └──────────┬──────────┘
       │ • 이미지분석/OCR│                         │
       │ • AI 요약·태깅 │              ┌──────────▼──────────┐
       │ • 썸네일 생성  │              │ 알림 워커(Google Chat)│
       │ • 다이제스트   │              └─────────────────────┘
       │ • 자동수집     │
       │   스케줄러(Beat)│
       └───────┬────────┘
               ▼
┌────────────────────────────────────────────────────────────────────┐
│                          데이터 레이어                               │
│  PostgreSQL (메인 DB + pgvector 벡터 + tsvector 전문검색)            │
│  Redis(캐시/큐)   ·   MinIO(파일: 이미지/비디오)                     │
│  ── (후속) Neo4j (Graph RAG) ──                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 18. 인프라·DevOps

| 영역 | 기술 |
|------|------|
| Container | Docker · docker-compose |
| CI/CD | GitHub Actions(테스트·커버리지·린트·타입·보안 스캔·배포) |
| Code 분석 | SonarQube |
| 보안 스캔 | Trivy · Snyk · Gitleaks · pip-audit |
| 부하 테스트 | k6 |
| Secrets | GitHub Secrets / 시크릿 매니저 |

**인프라 환경**: 현재 개발·초기 운영은 **로컬 Docker Compose** 기준이다. 여러 컨테이너(frontend, backend API, Celery worker, Celery Beat, Redis, PostgreSQL+pgvector, MinIO, Flower, 필요 시 Prometheus/Grafana/Mailpit)가 함께 뜬다. AI 호출은 별도 gateway 컨테이너 없이 OpenRouter API(`OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`)로 수행한다. 확장 시 AWS(ECS/EKS·RDS(pgvector)·S3·등)로 이전할 수 있게 컨테이너와 환경변수를 분리한다.

**모노레포 구조** (v1.0 계승, bun·pnpm→bun 반영):
```
infosnack-monorepo/
├── backend/   (FastAPI: api·core·db·models·schemas·services·ai·crawlers·search·workers + alembic·tests)
├── frontend/  (Next.js: app·components·hooks·stores·lib·types + tests)
├── extension/ (Plasmo)
├── openapi/infosnack-api.yaml
├── docker/ · docker-compose.yml · .env.example
├── pyproject.toml(uv) · package.json(bun workspaces 루트)
```

---

## 19. 비기능 요구사항 (NFR)

### 19.1 성능 🔴[실측 후 확정]
| 항목 | 목표 |
|------|------|
| API p95(읽기) | < 300ms |
| 검색 p95 | < 500ms |
| 라이브러리 LCP | < 2.5s |
| 수집→라이브러리 노출 지연 | < 5분(수동) / 주기 내(자동) |
| 이미지 분석 포함 처리 | 콘텐츠당 < 2분 🔴 |

### 19.2 확장성
- 수집·처리는 Celery 워커 수평 확장. API stateless
- Postgres 수직 확장 우선, pgvector 한계 시 §8.1 전환 트리거

### 19.3 가용성·신뢰성
- 파이프라인 durable execution(Postgres checkpointer) 중단 복구
- 외부 의존(LLM·크롤링·Vision) 장애 격리(서킷브레이커·폴백·재시도)
- Postgres 일일 백업 + 이중화 고려, MinIO 백업

### 19.4 보안
- HTTPS·보안 헤더(HSTS·CSP), 입력 검증(Pydantic), SQL 인젝션/XSS 방어
- 시크릿 외부화(API 키·SNS 세션·LLM·MinIO), 의존성/컨테이너 취약점 스캔(CI)
- 공개 공유 토큰: 추측 불가·읽기전용·비활성화 기능

### 19.5 관측성
- Sentry(프론트·백엔드), 구조화 JSON 로깅(요청ID·user_id), Prometheus/Grafana 메트릭
- 메트릭: 수집량·파이프라인 성공률·LLM 비용·검색 레이턴시·크롤링 실패율
- 알림: 파이프라인 실패·자동수집 반복 실패·비용 급증

### 19.6 비용 관리
- LLM 모델 티어링·토큰/비용 추적·예산 가드. Vision/OCR는 이미지당 1회 캐시(재처리 방지)

---

## 20. 품질·테스트 전략

> 전사 강제: **TDD(Red-Green-Refactor)** + **커버리지 85%+** + **Playwright E2E**. v1.0의 3단계 품질 파이프라인 계승.

### 20.1 3단계 품질 파이프라인
```
[1] LOCAL (pre-commit): Husky·lint-staged·Commitlint·Gitleaks / Ruff·MyPy·Bandit
      ↓ push
[2] CI (GitHub Actions): Vitest·Pytest·Playwright / pip-audit·Trivy·k6 / 커버리지 85% 게이트
      ↓ merge
[3] ANALYSIS (server): SonarQube·Snyk
```

### 20.2 테스트 피라미드
**백엔드(pytest)**: 단위(도메인·dedup·RRF·요약파서·스키마) / 통합(API·DB·인증, testcontainers Postgres) / 파이프라인(LangGraph 노드·그래프, LLM 모킹) / 외부의존(크롤러·LLM·Vision 모킹, Schemathesis API 계약)
**프론트(Vitest+Testing Library)**: 컴포넌트·훅·유틸
**E2E(Playwright)**: 핵심 플로우

### 20.3 LLM·비결정성 테스트 🟡
- LLM 출력 직접 단언 대신 ① 구조화 출력(Pydantic) 스키마 준수 검증 ② 모킹 응답으로 로직 분기 ③ 골든셋 회귀(사실 정확도는 사람 평가)
- 검색: 결정적 픽스처 임베딩으로 RRF·랭킹 검증
- 이미지 분석: 모킹 Vision 응답으로 파이프라인 검증

### 20.4 E2E 핵심 시나리오
1. 로그인 → 라이브러리 진입
2. 브라우저 확장/공유 → 저장 → 라이브러리에 등장(처리 완료)
3. 수집처 등록(미리보기) → 자동 수집 → 출처 표시 확인
4. 검색(하이브리드) → 결과 → 상세(이미지 분석 표시)
5. 챗봇 질문 → 출처 인용 답변
6. 다이제스트 큐레이션 → 배포 → 공개 공유 링크 열람(비인증)
7. (admin) 파이프라인 모니터링·재처리

### 20.5 CI 게이트
- 린트·타입·단위·통합·커버리지 85% 미달 시 머지 차단. E2E는 머지/배포 전 프리뷰 실행

---

## 21. 개발 로드맵

> v1.0 Phase 계승 + v2.0 스택 반영. 각 Phase는 검증 가능한 done-when을 가진다. 기간 🔴[가정].
> **현재 개발 범위 = Phase 1~4** (수집·처리·검색·다이제스트·RAG 챗봇). Phase 5부터 후속 개발.

### Phase 0 — 기반 셋업 (1~2주)
- 모노레포(backend/frontend/extension), Docker Compose(Postgres+pgvector·Redis·MinIO)
- FastAPI+uv / Next.js 16+bun 부트스트랩, CI(테스트·커버리지·린트·타입·보안), Sentry
- **done-when**: `/health` 200, 빈 앱 배포, CI 그린, 커버리지 게이트 작동

### Phase 1 — 핵심 루프 (4~6주)
- 초대 기반 로그인/가입(SSO는 후속 확장), 브라우저 확장(수동 수집), 공개 웹 크롤러
- 이미지 추출·분석·OCR 파이프라인(Vision), AI 요약·태깅, 썸네일
- 라이브러리 UI(목록·검색·필터·상세), 콘텐츠 메모, 번역, 하이라이트·주석, 읽기 위치 보존
- **Postgres 하이브리드 검색**(tsvector+pgvector+RRF, OCR 포함)
- 자동 수집 기반(수집처 등록 UI·자동 감지·Celery Beat·웹/RSS)
- **done-when**: 확장으로 저장→처리→라이브러리 노출·검색, dedup·요약 샘플 합격, 커버리지 85%

### Phase 2 — 플랫폼 확장 (4~6주)
- YouTube(자막)·X/Facebook/LinkedIn/Threads(Playwright)·Reddit·이메일 파서
- 모바일 공유시트, Nanobanana Pro 썸네일, 계정형 자동 수집
- 수집처 관리 화면(상태·실패 자동 일시중지+알림), 자동 수집 고급 레시피
- 관리자 대시보드, 알림 채널(Google Chat·Slack·Webhook), 태그 관리·벌크 재태깅, 데이터 내보내기, AI 엔진·임베딩 엔진 설정, 전체 재임베딩 잡, i18n
- **done-when**: 주요 플랫폼 저장 E2E, 자동수집 안정 동작·실패 복구

### Phase 3 — 다이제스트 (3~4주)
- 주간/일간 자동 생성, 트렌드·토픽 추출, AI 후보 추천→큐레이션→확정
- 공개 공유 링크(추측 불가 토큰·비인증 읽기전용), 대표 이미지, Google Chat 알림
- **done-when**: 큐레이션→배포→공개 링크 열람 E2E, 알림 전송

### Phase 4 — RAG 챗봇 (4~6주)
- 하이브리드 검색 기반 RAG 질의응답(출처 인용·스트리밍), 콘텐츠 한정 챗봇
- **done-when**: 전역 챗봇 출처 인용 답변 E2E, 콘텐츠 한정 챗봇의 본문 기반/관련 없음/외부 검색 보강 분기 E2E, 할루시네이션 억제(근거 없으면 "정보 없음")

### Phase 5 — 후속 개발 (이후)
- **Graph RAG(Neo4j)** 도입(관계형/멀티홉 질의 수요 확인 시, F-19)
- 개인/팀 라이브러리 분리·권한(F-20), 유사 콘텐츠 추천(F-23), 인사이트 대시보드(F-21)
- AWS 마이그레이션

### 의존성
```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
(Phase 2~4는 Phase 1 파이프라인 기반)
```

---

## 22. 성공지표

> **[v1.0→v2.0]** 여러 팀 확장 반영. 사내 도구이므로 매출 지표 없음. 핵심 질문: *"팀이 InfoSnack 덕분에 정보를 덜 놓치고 더 잘 공유·재발견하는가?"*

| 지표 | 목표 🔴[가정] |
|------|--------------|
| 주간 활성 사용자 | 도입 팀 인원의 ≥ 60% |
| 주당 수집 콘텐츠 수 | 팀당 ≥ 30개 |
| 다이제스트 열람률 | ≥ 80% |
| 챗봇 질의 수 | 주 ≥ 20회 |
| 검색 사용률 | 주 ≥ 1회/인 |
| 북마크 저장 수 | 주 ≥ 10개 |
| 중복/노이즈 체감(정성) | 분기 회고 |
| 파이프라인 일일 성공률 | ≥ 99% |
| 요약 사실 정확도 | ≥ 95%(샘플) |

> 초기 4주 데이터로 재보정.

---

## 23. 리스크·오픈이슈

### 23.1 리스크 (기술·운영 — 법적/사업은 비목표)
| ID | 리스크 | 심각도 | 완화책 |
|----|--------|:------:|--------|
| R-01 | SNS 크롤링 차단·구조 변경 | 높음 | Playwright 세션 관리, 실패 자동 일시중지+알림, 프록시(필요시) |
| R-02 | LLM/Vision API 비용 증가 | 중 | 모델 티어링, 이미지 1회 분석 캐시, 배치 최적화, 예산 가드 |
| R-03 | LLM 요약 할루시네이션 | 높음 | 근거 내 요약·출처 보존·구조화 출력·품질 게이트·샘플 평가 ≥95% |
| R-04 | RAG 정확도(특히 후속 Graph RAG) | 중 | 출처 인용·근거 없으면 "정보 없음", 콘텐츠 한정 챗봇은 관련성 판정 후 본문 우선 답변·필요 시 외부검색 보강, 엔티티 추출 품질·피드백 루프 |
| R-05 | 자동수집 소스 방치/중복 누적 | 중 | 수집처 관리 화면, 최소 주기 가이드, 중복 건너뛰기 |
| R-06 | 공개 공유 링크 노출 | 중 | 추측 불가 토큰·읽기전용·최소 정보·비활성화 기능 |
| R-07 | 파이프라인 중단·부분 실패 | 중 | durable execution(checkpointer)·실패 격리·dead-letter·재처리 |
| R-08 | 데이터 유실 | 높음 | 일일 백업·이중화, MinIO 백업 |
| R-09 | 도구 효용 미달(팀이 안 씀) | 높음 | 입력 마찰 최소화(확장·공유시트), 알림 최소화, 챗봇 가치 체감, 베타 회고 |

### 23.2 구현 결정 사항
| ID | 결정 항목 | 결정 |
|----|----------|------|
| O-01 | 임베딩 모델 | 초기 provider는 OpenRouter, 모델은 `qwen/qwen3-embedding-8b`, dimension은 **4096**. 모델 자체는 32~4096 output dimension을 지원한다. 관리자 설정에서 OpenRouter embedding 모델 ID 또는 dimension을 변경할 수 있고, model/dimension 변경 시 전체 콘텐츠 재임베딩 잡 실행 |
| O-02 | LLM/Vision·리랭커 모델 | 초기 provider는 OpenRouter. 메인 LLM/Vision 모델은 `~anthropic/claude-sonnet-latest`(text+image→text), 리랭커는 `cohere/rerank-4-fast`. 관리자 설정에서 OpenRouter 모델 ID·API key·base URL 변경 가능 |
| O-03 | 배포 환경 | 로컬 Docker Compose 기준. frontend/backend/worker/beat/Redis/Postgres+pgvector/MinIO/Flower 등 다중 컨테이너 구성. OpenRouter는 외부 API로 호출 |
| O-04 | 검색 강화 | 하이브리드 검색에 BM25 + RRF + 한국어 관련도 보강을 포함. VectorChord-bm25 또는 동등 Postgres BM25 확장, 한국어 보강용 PGroonga/pg_bigm/동등 확장은 실측 후 선택 |
| O-05 | Graph RAG | 현재는 후속. 당장 구현하지 않음. 자동 요약·태그 기반 그래프/옵시디언식 시각화는 후속 검토 |
| O-06 | 인증 방식 | 이메일 기반 초대 가입/로그인 |
| O-07 | 멀티팀 격리 | 현재는 전체 공유 + 팀 필터. 후속 `org_id` 기준 부분 격리와 개인/팀 라이브러리 분리를 도입할 수 있게 schema와 권한 구조를 준비 |

### 23.3 구현 직전 재확인 필요 (시간 민감)
| 항목 | 왜 재확인하나 | 확인 기준 |
|------|--------------|----------|
| Next.js 16 렌더링·캐싱 전략(Cache Components/PPR) | 제품 기능 결정이 아니라 화면별 정적 셸/동적 데이터/스트리밍 경계를 정하는 프론트엔드 구현 이슈. 캐시가 잘못 잡히면 검색·라이브러리·관리자 데이터 freshness에 영향 | 공식 Next.js 문서에서 `cacheComponents`, `use cache`, `<Suspense>`, request-time data 처리 방식을 라우트별로 확인 |
| OpenRouter/Hugging Face 모델 메타데이터 | 모델 alias·가격·context·모달리티·rate limit은 변경될 수 있음. 특히 `~anthropic/claude-sonnet-latest`는 최신 Sonnet으로 redirect되는 alias | OpenRouter 공식 모델 페이지/API에서 `~anthropic/claude-sonnet-latest`, `qwen/qwen3-embedding-8b`, `cohere/rerank-4-fast`의 context·가격·입출력 modality·provider 상태를 재확인하고, Hugging Face 모델 카드에서 Qwen embedding dimension 변경 여부 재확인 |
| LangGraph checkpointer/durability API | 파이프라인 재개·실패 복구가 `thread_id`, Postgres checkpointer, durability 모드에 의존 | 공식 LangGraph 문서에서 `AsyncPostgresSaver`, durability 모드, resume 방식 확인 |
| arXiv/GitHub/Hugging Face rate limit | 자동 수집 안정성과 스케줄러 간격에 직접 영향 | 현재 기준: arXiv 1요청/3초+단일 connection, GitHub 미인증 60/hr·인증 5,000/hr+secondary limit, HF 5분 고정윈도우+`RateLimit` 헤더. 구현 직전 공식 변경 여부 재확인 |
| SNS 필수 수집 자동화 검증 | Facebook·LinkedIn·Threads는 필수 수집 대상이고 X도 현재 개발 범위이지만, UI/차단 정책 변화가 잦음 | 실제 계정 Playwright 세션으로 로그인 유지, 목록/상세 수집, 실패 자동 일시중지, 차단·rate limit 대응을 구현 직전 검증 |
| Postgres 한국어 검색 확장 | BM25·한국어 관련도 보강이 Docker Compose/Postgres 버전과 호환되어야 함 | VectorChord-bm25, PGroonga, pg_bigm 또는 동등 확장의 Postgres 16+ 설치·성능·한국어 품질 확인 |

---

## 부록 A. 2025-2026 기술 결정 노트 (deep-research 검증)
> 3차 deep-research(검색 에이전트 115개) 검증. 🟢 primary 출처, 🟡 표준지식. 시간 민감 — 구현 직전 재확인.

- 🟢 **Next.js 16 Cache Components/PPR**: `use cache`는 정적 셸 캐싱, `<Suspense>`는 요청 시점 데이터 스트리밍에 사용한다. 라우트별 freshness 요구사항에 따라 캐시·동적 경계를 정한다. (nextjs.org 공식)
- 🟢 **TanStack Query + RSC**: 서버 요청당 새 QueryClient, prefetch + HydrationBoundary. (tanstack.com 공식)
- 🟢 **bun 프로덕션(Vercel)**: `vercel.json` `bunVersion:"1.x"`, ISR 시 `bun run --bun`(Beta). (vercel.com 공식)
- 🟢 **uv**: `uv run fastapi dev`로 lock+venv+run. (astral.sh 공식)
- 🟢 **LangGraph**: workflows vs agents(우리는 워크플로우), durability 3모드, Postgres checkpointer(개발자 트리거 resume), structured output(`response_format`→`structured_response`). (langchain 공식)
- 🟢 **Postgres BM25**: VectorChord-bm25 `<&>` 연산자(음수 점수). (tensorchord 공식)
- 🟡 **작업큐**: 사내는 ARQ도 후보였으나 **Celery 확정**(사용자 결정). Celery Beat 스케줄링.
- 🟡 **임베딩/요약 모델, HNSW 튜닝, RRF, reranking, 큐레이션 UX**: 적대적 검증 미통과 → 인터페이스+선택 기준으로 두고 실측(O-01·O-02·O-04).
- 🟡 **React Compiler**: "프로덕션 완전 준비" 주장 검증 실패 → 무비판 채택 금지, 선택적 검증 후.

## 부록 B. Graph RAG vs 일반 RAG (도입 판단용)
| 항목 | 일반 RAG(현재 개발 범위) | Graph RAG(후속) |
|------|---------------|-----------------|
| 데이터 | 문서+벡터(pgvector) | +그래프(Neo4j) |
| 검색 | 하이브리드(전문+벡터+RRF) | +그래프 탐색 |
| 맥락 | 개별 문서 | 문서 간 관계 |
| 멀티홉 | 약함 | 강함 |
| 복잡도 | 낮음 | 높음 |
| 적합 질문 | "X 알려줘" | "X와 Y의 관계?", "X 언급한 모든 글?" |

**InfoSnack 판단**: 현재 개발 범위는 운영 단순성을 위해 일반 RAG(Postgres 하이브리드). "최근 트렌드 종합", "관계형 질의" 수요가 베타에서 확인되면 Graph RAG로 강화(F-19, O-05).

## 부록 C. 리서치 출처 (검증 통과분)
- 수집 rate limit: arXiv(info.arxiv.org/help/bulk_data), GitHub(docs.github.com), HF(huggingface.co/docs/hub/rate-limits) — primary
- 파이프라인: LangGraph 공식(persistence·workflows-agents·structured-output), AInewsbot(github.com/druce/AInewsbot)
- 프론트: nextjs.org(cacheComponents·next-16), tanstack.com(advanced-ssr), vercel.com(bun)
- 백엔드: astral.sh(uv), 검색: VectorChord-bm25(github.com/tensorchord)
- 중복제거 참고: NVIDIA NeMo Curator SemDeDup, NewsCatcher

> **인용 안 한 것(검증 실패/비목표)**: 시장 규모·이메일 벤더 가격(비목표), pgvector 정량 성능·임베딩 모델 비교·큐레이션 UX 수치(검증 실패 → 실측), 소스 약관/CAN-SPAM 등 법적 내용(비목표).

## 부록 D. 유사 서비스 벤치마크 (4차 deep-research, 반영 갭)
> 유사 오픈소스/서비스와 비교해 도출한 기능 갭. 25개 주장 전부 primary 출처 검증(0 기각). **반영한 것만** 정리(G1 영구아카이브·G2 import·G7 export포맷·G9 중복병합·세분권한은 팀 결정으로 제외).

| 갭 | 반영 | 벤치마크(출처) |
|----|------|---------------|
| **G3** AI 모델 provider 전환 | §0.3·§6.4 (`AIModelProvider`·`Embedder`·`Reranker` 추상화, 초기 provider는 OpenRouter) | Karakeep, Linkwarden (github.com/karakeep-app/karakeep, linkwarden.app) |
| **G4** per-item 콘텐츠 번역 | F-24·§6.5·`content_translations` | Folo "AI RSS Reader" (github.com/RSSNext/folo) |
| **G5** 하이라이트·주석·읽기위치 | F-22·§8.6·`highlights`·`read_status.scroll_position` | Omnivore (github.com/omnivore-app/omnivore) |
| **G6** 알림 웹훅·Slack | F-14·§11·`notification_channels` | Miniflux (github.com/miniflux/v2) |
| **G8** 기존 태그 매핑 + 소급 재태깅 | F-05·F-25·§6.4 | Karakeep, Linkwarden |

**검증된 설계(갭 아님)**: 하이브리드 검색(tsvector+pgvector+RRF)은 pgvector 코어 컨트리뷰터(Jonathan Katz, jkatz.github.io)가 best practice로 확인 → `rrf_k`를 설정값으로 노출 권장.
**의도적 제외**: G1(영구 아카이브)·G2(북마크 import)·G7(OPML/ZIP export)·G9(중복 병합)·Notion급 세분 권한 — 팀 판단으로 현재 개발 범위 밖.

---

*문서 끝. InfoSnack PRD v2.0 — v1.0(제품 정의) + deep-research 4회 검증 + E2E 구현 디테일. 팀 리뷰·베타 결과에 따라 갱신.*
