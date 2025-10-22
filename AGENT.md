# AGENT Guide — Shinchon Montessori Website Revamp

## Purpose
- Serve as the entry point for any agent contributing to the 신촌몬테소리유치원 웹사이트 개편 프로젝트.
- Summarize the intent, scope, and implementation decisions recorded in the current specification drafts (버전 1.0, 2025-10-22 기준).
- Define the workflow for updating specs and logging project history.

## Project Snapshot
- **Goal**: Deliver a fully modernized, responsive website that improves usability, strengthens admissions funnels, and enhances parent communication (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:105-187`).
- **Primary sections** (public): 유치원 소개, 교육 프로그램, 입학 안내, 알림마당 (`신촌몬테소리유치원_사이트맵_및_페이지구조.md:5-110`).
- **Secure parent portal**: 반 소식, 학사 일정, 서식 자료실, 1:1 문의, 운영위원회, 회원정보 관리 (`신촌몬테소리유치원_사이트맵_및_페이지구조.md:1145-1178`).
- **Administrator goals**: Streamlined CMS, analytics, automated backups, and compliant document management (`신촌몬테소리유치원_개선안_요약본.md:99-109`, `신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:234-244`).

## Functional Scope Overview
1. **Public Experience**
   - Storytelling about philosophy, staff, facilities, and programs.
   - Admissions funnel (process, FAQ, tuition, online 상담 및 원서 접수).
   - News center with 공지사항, 가정통신문, 행사, 급식 달력, 갤러리.
2. **Parent Portal (로그인)**
   - 반별 교육활동 게시판 with media uploads and comment controls.
   - 학사 일정 캘린더, 서식 다운로드, 1:1 문의, 운영위원회 자료.
   - 회원정보/자녀 정보 관리 supporting 최대 3명 자녀 기록 (`신촌몬테소리유치원_기능_명세서.md:27-74`, `262-320`).
3. **Shared Modules**
   - 회원 가입/로그인/소셜 로그인, 비밀번호 재설정, 권한 관리.
   - 검색, 파일 업로드, 알림, 통계와 로그 기록.

## Technical Decisions
- **UI Layer**: shadcn/ui + Tailwind 커스터마이징으로 일관된 디자인 시스템 유지 (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:125`, `신촌몬테소리유치원_개선안_요약본.md:71`, `신촌몬테소리유치원_기능_명세서.md:7`).
- **Selected Application Stack**: Next.js(App Router) + tRPC + Prisma + PostgreSQL + Redis + NextAuth. 요구사항 문서가 제시한 Node.js 계열 권장 스택을 TypeScript 전용으로 구체화하여 프런트/백이 스키마를 공유하도록 합니다 (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:115-125`, `1235-1244`).
- **Server Responsibilities**: tRPC 라우터로 회원/자녀/게시판/상담/파일 업로드/알림 API를 구성하고 Prisma 스키마로 영속 데이터를 관리합니다 (`신촌몬테소리유치원_기능_명세서.md:27-74`, `252-320`).
- **Integrations**: SMS 인증, 이메일 발송, 지도 API, Google Analytics/Hotjar 등을 모듈화하여 적용합니다 (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:1207-1249`).
- **Testing & Compliance**: 접근성·성능·보안·반응형·브라우저 호환 테스트를 출시 필수 조건으로 유지합니다 (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:1200-1250`).

## Admin Scope & Kickoff Plan
- 관리자 대시보드, 콘텐츠 관리, 통계, 자동 백업 요구사항을 초기에 함께 구현합니다 (`신촌몬테소리유치원_개선안_요약본.md:99-109`, `신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:234-244`).
- Next.js 내 `/admin` 경로나 별도 레이아웃을 준비하여 shadcn/ui 컴포넌트(테이블, 폼, 차트 등)로 구성하고, NextAuth + tRPC 미들웨어로 역할 기반 접근을 제어합니다 (`신촌몬테소리유치원_기능_명세서.md` 전반).
- Prisma 스키마는 관리자와 학부모 포털이 동일한 데이터 모델을 공유하도록 설계합니다 (`신촌몬테소리유치원_기능_명세서.md:27-74`, `262-320`).

## Legacy Site Findings to Address
- No viewport meta tag → mobile renders scaled-down (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:111-123`).
- Legacy `slidesjs` carousel failure + favicon 404s (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:112-124`).
- Authentication-gated pages rely on alert dialogs; must redirect with guidance (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:171-187`).
- Current 팝업이 네이버 폼 외부 의존, 쿠키 기반 on/off만 제공 (`신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md:220-244`).
- 회원정보 수정은 단일 화면, 자녀 정보 최대 3명 입력, 전화번호 3분할 필드, zip 팝업 사용 등 마이그레이션 시 주의 (`신촌몬테소리유치원_사이트맵_및_페이지구조.md:1180-1183`).

## Current Assets
- `신촌몬테소리유치원_개선안_요약본.md` — high-level goals and phased plan.
- `신촌몬테소리유치원_웹사이트_개선_요구사항_명세서.md` — detailed UX, content, and tech requirements.
- `신촌몬테소리유치원_사이트맵_및_페이지구조.md` — structural layout and per-page expectations.
- `신촌몬테소리유치원_기능_명세서.md` — functional specs plus API/data models.
- Repository root — Next.js(App Router) 기반 프런트엔드 (TypeScript, Tailwind, ESLint, npm).
- `src/app/styleguide/page.tsx` — shadcn/ui 기반 컴포넌트 프리뷰 페이지 (Hero, 카드, 탭, 테이블, 폼 샘플).
- `AGENT.md` (this file) — coordination reference and change log root.

## Workflow for Agents
1. **Before Editing**
   - Review relevant spec sections to avoid diverging from approved scope.
   - Confirm whether changes impact multiple documents; keep them synchronized.
2. **While Editing**
   - Prefer `apply_patch` for manual edits; document assumptions inline with concise comments only when necessary.
   - Align UI work with shadcn/ui patterns; capture component decisions back in the specs if new patterns emerge.
3. **After Editing**
   - Update affected `.md` specs and append a summary entry under “History Log” below.
   - Note any outstanding questions or follow-up tasks in the specs (e.g., TODO blocks).
   - If new assets are added, list them under **Current Assets** in this guide.
4. **Communication**
   - Keep references to spec line numbers when reporting changes to maintain traceability.
   - When introducing new tooling or architectural shifts, document rationale in both the relevant spec and the History Log.

## Immediate Next Steps (Suggested)
- Refine shadcn/ui 테마 변수(파스텔 팔레트, 폰트 등)와 공통 토큰 문서화.
- Integrate tRPC + Prisma + NextAuth + Redis into the Next.js project and outline auth/role middleware.
- Model Prisma schema for 회원/자녀/게시판/상담/알림 및 설정 테이블, including admin roles.
- Scaffold `/admin` 레이아웃과 접근 제어 미들웨어 골격.
- Draft migration plan for legacy content, especially parent portal data and media.

## History Log
- 2025-10-22 — Initial AGENT.md created from v1.0 specification set; established shadcn/ui as mandatory UI layer and recorded legacy remediation items.
- 2025-10-23 — Finalized TypeScript full-stack choice (Next.js + tRPC + Prisma + PostgreSQL + Redis + NextAuth) and confirmed admin workspace is part of initial build scope.
- 2025-10-23 — Initialized Git repository using separate `.gitdir` store (workspace is `/Users/c2/Documents/Personal/shinchon-project`) and added base project docs/configs.
- 2025-10-23 — Added Prettier configuration (`.prettierrc`) with shared formatting rules (tabs, width 120, trailing commas, etc.).
- 2025-10-23 — Scaffolded Next.js project at repo root (TypeScript, Tailwind, ESLint, npm) and verified with `npm run lint`.
- 2025-10-23 — Initialized shadcn/ui CLI, added core components (button, card, badge, tabs, table, input, textarea, label), created `/styleguide` preview page, and restructured project to live at root for simpler layout.
