# Shinchon Montessori — ASCII Wireframes

각 화면의 주요 레이아웃과 인터랙션 포인트를 ASCII 형태로 정리했습니다. 영역 간 구분, CTA, 데이터 피드 위치를 한눈에 파악할 수 있도록 화면 유형(퍼블릭 웹, 학부모 포털, 관리자 콘솔)별로 그룹화했습니다.

---

## 1. Public Web (퍼블릭)

### 1.1 Home (`/`)
```
+================================================================================+
| HERO (full width, gradient background)                                         |
|                                                                                |
| ┌ Badge ──────────────────────┐                                                |
| │ Shinchon Montessori         │  ┌──────────────────────────────────────────┐  |
| └─────────────────────────────┘  │ Headline (multi-line)                   │  |
|                                   │ Subtitle paragraph                      │  |
|                                   │ [CTA: 입학 상담] [CTA: 프로그램]        │  |
|                                                                                |
| Stats Row:                                                               ▲     |
| ┌────────┐ ┌────────┐ ┌────────┐    (3 equal cards, iconless)           │     |
| | label  | | label  | | label  |                                        │Hero |
| | value  | | value  | | value  |                                        │Area |
| └────────┘ └────────┘ └────────┘                                        ▼     |
+--------------------------------------------------------------------------------+
| 교육 약속 (3 card grid)                                                        |
| [Icon + Title + Body] [Icon + Title + Body] [Icon + Title + Body]              |
+--------------------------------------------------------------------------------+
| 프로그램 트랙 (3 columns, stacked focus list)                                  |
+--------------------------------------------------------------------------------+
| 하루 일과 (timeline row)                                                       |
| 08:30 │ 10:00 │ 12:00 │ 13:30 │ 15:00                                          |
+--------------------------------------------------------------------------------+
| 입학 절차 (vertical stacked steps)                                             |
+--------------------------------------------------------------------------------+
| 최신 소식                                                                     |
| ┌────Card────┬────Card────┬────Card────┐                                       |
| | Category   | Category   | Category   |                                       |
| | Title      | Title      | Title      |   Fallback: 최신글 3개                 |
| | Date       | Date       | Date       |                                       |
| | Summary..  | Summary..  | Summary..  |                                       |
| | [Link→]    | [Link→]    | [Link→]    |                                       |
| └────────────┴────────────┴────────────┘                                       |
+--------------------------------------------------------------------------------+
| Visit & Contact                                                                |
| ┌──────────────Left (copy+CTA)──────────────┐ ┌─ Info Card Grid (2x2) ──────┐  |
| | Badge + Title + Paragraph                 | | 주소 | 상담시간 | 투어 | ...|  |
| | [CTA: 투어신청]                           | └─────────────────────────────┘  |
| └──────────────────────────────────────────┘                                   |
+================================================================================+
```

### 1.2 News List (`/news`)
```
┌ Tabs (전체 | 공지 | 가정통신문 | 행사 | 뉴스레터) ────────────────────────────┐
|                                                                             |
|  ┌─Card──────────────────────────────────────────────────────────────────┐  |
|  | Category badge · Date                                                 |  |
|  | HEADLINE                                                              |  |
|  | Summary snippet (2 lines)                                             |  |
|  | [자세히 보기 →]                                                       |  |
|  └───────────────────────────────────────────────────────────────────────┘  |
|  (반복, responsive 1-2 columns)                                              |
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 News Detail (`/news/[slug]`)
```
Breadcrumb: 홈 > 알림마당 > 카테고리
┌─────────────────────────────────────────────────────────────────────────┐
| Category badge · Date · Audience                                        |
| H1 Title                                                                |
| Summary paragraph (optional)                                            |
|-------------------------------------------------------------------------|
| Rich text paragraphs (line-height relaxed)                              |
|-------------------------------------------------------------------------|
| Attachments list                                                        |
|  • [Label + External link]                                              |
|-------------------------------------------------------------------------|
| [← 목록으로 돌아가기]                                                   |
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Parent Portal (로그인)

### 2.1 Dashboard (`/parents`)
```
┌ Hero ────────────────┐
| Badge + Greeting      |  Info copy about portal usage
└──────────────────────┘

등록된 자녀 (responsive grid)
┌Card────────┐ ┌Card────────┐
| Name        | | Name        |
| Classroom   | | Classroom   |
| 담임/보조   | | 담임/보조   |
└────────────┘ └────────────┘

최근 반 소식
┌Card─────────────────────────────────────────────┐
| Classroom · Date                                |
| Title                                           |
| Summary                                         |
| Attachments bullet list                         |
| [자세히 보기 →]                                 |
└────────────────────────────────────────────────┘

빠른 바로가기 (3 cards row)
```

### 2.2 Class News (`/parents/posts`, `/parents/posts/[id]`)
```
List view:
┌ Filter tabs (전체 / 자녀별) ─────────────────────────────────────────────┐
| Card: Classroom badge, Title, Date, snippet, attachments, [자세히]       |
└──────────────────────────────────────────────────────────────────────────┘

Detail view:
Breadcrumbs → Title → Classroom/Date meta
Summary paragraph
Rich text body (paragraph stack)
Attachments (if any)
[목록으로 돌아가기]
```

### 2.3 Schedule (`/parents/schedule`)
```
Upcoming month window (now ~ now+1M)
Card per 일정: Classroom / Title / DateRange / Location / Description
```

### 2.4 Resources (`/parents/resources`)
```
Hero copy + Buttons

Section: 서식 자료실
┌ Card ─────────────────────────────┐
| Category · 게시일                 |
| Title + Description               |
| [자료 열기] button                |
└───────────────────────────────────┘

Section: 운영위원회 자료 (동일 UI, searchParams.section=committee 시 상단으로)
```

### 2.5 1:1 Inquiries (`/parents/inquiries`)
```
Stats cards: 전체 / 접수됨 / 검토 중 / 답변 완료

Left column: 문의 작성 폼
 - Select(문의 유형)
 - 제목 / 내용
 - Status/Error toast

Right column: 최근 문의 리스트
┌ Card ─────────────────────────────────────────────┐
| Status badge (접수/검토/완료)                     |
| Category · CreatedAt                              |
| Subject                                           |
| Message (multiline)                               |
| Reply bubble (if adminReply)                      |
└───────────────────────────────────────────────────┘
```

---

## 3. Admin Console

### 3.1 Dashboard (`/admin`)
```
Header: 콘텐츠 관리 + CTA 버튼 (반 소식 / 서식자료 / 문의)

Form: NewsPostForm (create mode)
 [Title] [Category] [Summary] [RichTextEditor]
 [PublishAt] [HeroImage] [Highlight checkbox] [Audience scope]
 [Advanced: Slug, Attachments x3]
 Submit → createNewsPostAction

Table: Registered posts
Columns: Category | Title | Summary | Audience | PublishAt | Created | Updated | Actions
Actions: [미리보기] [수정] [삭제]
```

### 3.2 News Edit (`/admin/news/[id]/edit`)
```
Same form as create but prefilled + hidden postId; submit runs updateNewsPostAction.
Button to return 홈
```

### 3.3 Class Posts (`/admin/class-posts`)
```
Form (create/edit mode) with classroom select, title, summary, publish date, editor, attachments.
Table: Classroom | Title | Summary | PublishAt | Actions (미리보기 / 수정 / 삭제)
```

### 3.4 Parent Resources (`/admin/parent-resources`)
```
┌ Form (create/edit) ──────────────────────────────────────────┐
| Title | Category                                             |
| Type select | Publish date                                   |
| File URL                                                    |
| Description                                                 |
└─────────────────────────────────────────────────────────────┘

Table:
 Type | Title/Description | Category | PublishAt | Link | [보기][수정][삭제]
 Edit route `/admin/parent-resources/[id]/edit` uses same component.
```

### 3.5 Parent Inquiries (`/admin/parent-inquiries`)
```
Stats cards (전체/접수/검토/완료)

List of inquiries:
┌ Card ───────────────────────────────────────────────────────────┐
| Header: Category · CreatedAt · Parent Name/Email · Status badge |
| Body: Original message box                                      |
| Form: status select + textarea(adminReply) + 저장 버튼          |
└─────────────────────────────────────────────────────────────────┘
```

---

### 사용 가이드
- 레이아웃 체계는 Tailwind CSS 토큰(`--brand-*`, radius, shadow)을 그대로 반영했습니다.
- Manager/Parent 화면은 Next Server Components + Server Actions 조합으로 동작하므로, 위 구조를 기준으로 UI 변경/테스트 시 참조하세요.

---

## 4. Legacy Site (shinchonkid.com) Layout Snapshot
> 실서비스 화면을 직접 캡처한 것이 아닌, 현재 사이트 정보구조/와이어를 문서와 관찰을 기반으로 단순화한 ASCII입니다.

### 4.1 Legacy Home
```
+==============================================================================+
| HEADER: 로고 | 상단 GNB (원소개 | 교육프로그램 | 입학안내 | 알림마당 | 커뮤니티) |
+------------------------------------------------------------------------------+
| Main Visual (슬라이드)                                                        |
|  [이미지]  [텍스트 단락 + 자세히보기 버튼]                                     |
+------------------------------------------------------------------------------+
| 공지/가정통신문 탭형 박스                                                     |
|  ┌─────────────┬─────────────┐                                                |
|  | 공지 리스트 | 가정통신문 |                                                |
|  | - 날짜+제목 | - 날짜+제목|                                                |
|  └─────────────┴─────────────┘                                                |
+------------------------------------------------------------------------------+
| 프로그램 / 커리큘럼 섹션 (아이콘 + 텍스트 카드 3~4개)                         |
+------------------------------------------------------------------------------+
| 포토 갤러리 (썸네일 4~6개)                                                    |
+------------------------------------------------------------------------------+
| 하단 주소/연락처/저작권 정보                                                   |
+==============================================================================+
```

### 4.2 Legacy Notice List
```
Breadcrumb: 홈 > 알림마당 > 공지사항

┌ Table ─────────────────────────────────────────────────────────────┐
| No | Title (링크)                         | Author | Date | Views   |
| 10 | 2026학년도 입학설명회 안내           | 관리자  | 10-14 | 132     |
| .. | ...                                   |        |      |         |
└───────────────────────────────────────────────────────────────────┘
[이전] [1][2][3] [다음]
```

### 4.3 Legacy Parent Portal (로그인 후)
```
Left Sidebar:
 - 반소식
 - 가정통신문
 - 학사일정
 - 앨범

Right Content:
┌ Widget: 반소식 리스트 (표 형태) ─────────────────────────────────────┐
| No | 제목 | 작성자 | 등록일 | 조회수                               |
└──────────────────────────────────────────────────────────────────────┘

Secondary: 첨부자료/다운로드 링크 목록, 텍스트 기반 상세
```

### 4.4 Legacy Admin (CMS)
```
Top nav tabs + Left tree 메뉴 (게시판별)
Main panel: form in table layout
┌───────────────────────────────────────────────┐
| 제목 [__________________________]              |
| 카테고리 [select]                             |
| 내용   [textarea WYSIWYG]                     |
| 파일첨부 [Browse] [추가]                      |
| [등록] [취소]                                 |
└───────────────────────────────────────────────┘
목록은 표 기반 No/제목/등록일/조회수 구조.
```
