# Shinchon Montessori — Target Redesign Layouts (ASCII)
> 리뉴얼 목표 UI를 대비해볼 수 있도록, 퍼블릭/학부모/관리자 화면의 이상적인 레이아웃을 ASCII로 표현했습니다. 기존 대비 개선 포인트(히어로 비주얼, 카드형 대화형 요소, 데이터 피드 위치 등)를 강조했습니다.

---

## 1. Public Web (V2 Concept)

### 1.1 Home
```
+=====================================================================================================+
| Sticky Header: Logo | Primary Nav (About / Programs / Admissions / News / Parent Portal) | CTA Btn   |
+-----------------------------------------------------------------------------------------------------+
| HERO SECTION                                                                                       |
| ┌─────────────── Left Copy ───────────────┐ ┌───────────── Right Visual ─────────────────────────┐  |
| | Badge + Tagline                         | | Photo / video + floating stat chips                |  |
| | H1 multi-line                           | | CTA: Watch Tour                                   |  |
| | Body copy                               | |                                                   |  |
| | [CTA: Book Tour]  [CTA: Download Guide] | |                                                   |  |
| └─────────────────────────────────────────┘ └─────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------------------------------------+
| QUICK VALUE CARDS (4 cols)                                                                            |
| [Teachers ratio] [Montessori certified] [Outdoor space] [Extended care]                              |
+-----------------------------------------------------------------------------------------------------+
| STORY BLOCKS (alternating image/text rows)                                                           |
|  - Montessori fundamentals (image left)                                                              |
|  - Project-based learning (image right)                                                              |
|  - Family partnership (image left)                                                                   |
+-----------------------------------------------------------------------------------------------------+
| PROGRAM SECTION (Tab → Carousel)                                                                     |
| [Tabs: Casa Petit | Prime | Explorer]                                                                |
| ┌ Tab Content ────────────────────────────────────────────────────────────────────────────────────┐ |
| | Column 1: Timeline / Pillars                                                                     | |
| | Column 2: Photo collage                                                                         | |
| | Column 3: CTA (Download curriculum PDF)                                                         | |
| └─────────────────────────────────────────────────────────────────────────────────────────────────┘ |
+-----------------------------------------------------------------------------------------------------+
| DAILY EXPERIENCE (split horizontal timeline + vertical cards)                                       |
+-----------------------------------------------------------------------------------------------------+
| ADMISSIONS FUNNEL                                                                                    |
| Step cards + sticky CTA (Apply Now) + FAQ accordion                                                 |
+-----------------------------------------------------------------------------------------------------+
| NEWS STRIP                                                                                            |
| Horizontal scroll cards with category chips + highlight badge                                       |
+-----------------------------------------------------------------------------------------------------+
| FOOTER                                                                                               |
| 4 columns (Contact, Programs, Resources, Parent Portal) + legal + social links                      |
+=====================================================================================================+
```

### 1.2 Admissions Landing
```
Hero: background illustration + CTA
Section: Why Shinchon? (metrics)
Section: Process timeline (4 steps)
Section: Tuition & schedule tables (accordion)
Section: Download packet (form modal)
FAQ accordion grid
```

---

## 2. Parent Portal (V2 Concept)

### 2.1 Dashboard
```
Sticky top bar: Logo + user dropdown + notifications bell
Left nav rail:
 - Overview
 - Class news
 - Schedule
 - Resources
 - Forms & Requests
 - Messages

Main content (2-column responsive):
┌ Summary Row ─────────────────────────────────────────────────────┐
| [Child tile w/ avatar] [Attendance badge] [Upcoming event tile]  |
└──────────────────────────────────────────────────────────────────┘
┌ Feed area ─────────────────────┐ ┌ Action column ────────────────┐
| Class news cards (timeline)    | | Quick links (forms)           |
| Messaging snippet (last reply) | | Inquiry status widget         |
| Photo gallery carousel         | | Download center (chips)       |
└────────────────────────────────┘ └────────────────────────────────┘
Persistent bottom CTA: “Request 1:1 meeting”
```

### 2.2 Resources Center
```
Filter bar: Type dropdown + Category dropdown + search
List view toggles (card / table)
Card layout includes icon, file meta, tags, action menu (download / share)
```

### 2.3 Forms & Requests
```
Form directory grid (조퇴 신청, 투약 의뢰, 체험학습 등)
Each opens side-panel form with autosave + timeline of submitted requests
```

---

## 3. Admin (V2 Concept)

### 3.1 Unified Console
```
Layout: Left nav (Dashboard / News / Class Posts / Resources / Inquiries / Analytics / Settings)
Top bar: search, quick create, user menu
```

### 3.2 News Management (Kanban)
```
Board columns: Draft | Scheduled | Published | Highlighted
Cards show title, category, publish date, audience
Right drawer for editing (live preview, attachments manager, hero image uploader)
```

### 3.3 Class Posts
```
Calendar view + list toggle
Bulk actions (notify parents, duplicate, archive)
Inline metrics (views/read %)
```

### 3.4 Resources & Forms
```
Table with inline editing
Columns: Title | Type | Category | Audience | URL | Version | Updated
Modal editor with markdown description + file manager
```

### 3.5 Parent Inquiries (Helpdesk style)
```
Ticket list (filters: status, class, priority)
Ticket detail pane: conversation thread, canned responses, internal notes
Automation panel (auto-assign, SLA timers)
```

### 3.6 Side Navigation 기반 종합 레이아웃(제안)
```
+================================================================================================+
| TOP BAR: logo | 전역 검색 | Quick Create(+) | 알림 벨 | 사용자 메뉴                                |
+================================================================================================+
| SIDEBAR (fixed 260px)                                                                          |
|  Dashboard                                                                                     |
|  ─ Content 관리 ───────────────────────────────────────────────                                |
|   • 뉴스/공지                                                                                  |
|   • 반 소식                                                                                    |
|   • 학사 일정                                                                                  |
|  ─ 커뮤니케이션 ───────────────────────────────────────────────                                |
|   • 1:1 문의 (티켓)                                                                            |
|   • 알림/푸시 (추후)                                                                           |
|  ─ 데이터 & 사용자 ───────────────────────────────────────────────                             |
|   • 학부모 계정                                                                                |
|   • 교직원 계정                                                                                |
|   • 자녀/반 배정                                                                               |
|  ─ 리소스/설정 ───────────────────────────────────────────────                                  |
|   • 서식·운영위원회 자료                                                                        |
|   • 파일/에셋 라이브러리                                                                       |
|   • 통계/리포트                                                                                |
|   • 환경 설정                                                                                  |
+------------------------------------------------------------------------------------------------+
| MAIN CANVAS                                                                                    |
|  ┌ Breadcrumb + Page title + Kebab actions ───────────────────────────────────────────────────┐|
|  | Filter bar (chips, search, status, date range)                                             ||
|  | KPI summary cards (3~4)                                                                    ||
|  |--------------------------------------------------------------------------------------------||
|  | Data view toggle: [Table] [Kanban] [Calendar]                                              ||
|  |  - Table: selectable rows, inline edit cells, column picker                               ||
|  |  - Kanban: 컬럼=상태 (예: Draft/Scheduled/Published)                                       ||
|  |  - Calendar: 이벤트/반 소식 일정                                                          ||
|  |--------------------------------------------------------------------------------------------||
|  | Right drawer (slides in on row click)                                                      ||
|  |  • Form tabs: 기본정보 / 콘텐츠 / 첨부 / 대상 / 히스토리                                   ||
|  |  • Activity log + 댓글                                                                     ||
|  └────────────────────────────────────────────────────────────────────────────────────────────┘|
|  Footer: pagination · selected item actions (Publish/Archive/Notify)                          |
+================================================================================================+
```

**DB/기능 구조와의 매핑**
- `news_posts`, `class_posts`, `class_schedules`, `parent_resources`, `parent_inquiries`, `users`, `children`, `classrooms` 테이블이 모두 사이드바 섹션과 1:1 대응되도록 그룹화했습니다.
- “커뮤니케이션” 섹션은 `parent_inquiries`(티켓)와 향후 알림/푸시 큐(예: `notifications`)를 포함할 수 있게 설계했습니다.
- Drawer의 히스토리 영역은 기존 `updated_at` 외에 변경 로그 테이블을 추가하면 쉽게 확장 가능합니다.

---

### 비교 포인트
- **정보 구조**: 기존 사이트는 탭/표 기반으로 단일 컬럼에서 텍스트 리스트를 보여주는 반면, 리뉴얼안은 카드·모듈형 섹션과 스티키 CTA를 통해 스토리텔링과 전환 동선을 강화합니다.
- **데이터 표현**: 새 디자인은 실시간 위젯(알림, 문의, 첨부 다운로드 등)을 대시보드형 카드로 배치해 “지금 확인해야 할 정보”가 명확합니다.
- **운영 UX**: 관리자 화면은 보드/드로어/인라인 편집을 지원해 페이지 이동 없이 콘텐츠를 수정할 수 있어 기존 게시판형 UI보다 맥락 전환이 적습니다.
- **확장성**: 학부모 포털·관리자 콘솔 모두 사이드바 내비게이션과 패널/모달 패턴을 활용해 PWA·푸시 알림·분석 기능 등 Stage 3 요구사항도 쉽게 흡수할 수 있는 구조입니다.
