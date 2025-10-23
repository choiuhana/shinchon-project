export type ColorToken = {
	name: string;
	token: string;
	value: string;
	usage: string;
};

export type GradientToken = {
	name: string;
	token: string;
	value: string;
	usage: string;
};

export type TypographyToken = {
	name: string;
	token: string;
	size: string;
	lineHeight: string;
	usage: string;
	sample: string;
};

export type ScaleToken = {
	token: string;
	value: string;
	usage: string;
};

export const brandPrinciples = [
	{
		title: "Playful confidence",
		description:
			"대담한 코랄과 부드러운 곡선으로 아이들의 활력을 프리미엄 톤으로 표현합니다.",
		detail:
			"Primary 코랄과 라벤더 보조색을 중심으로 버튼, 아이콘, 일러스트의 시선을 자연스럽게 이끕니다.",
	},
	{
		title: "Curated clarity",
		description:
			"정보 구조는 명확하게, 여백과 타이포그래피는 여유 있게 구성해 학부모의 탐색 피로도를 낮춥니다.",
		detail:
			"20px·30px 베이스 그리드와 절제된 카드 섀도우로 화면 전반에 균형감 있는 위계를 만듭니다.",
	},
	{
		title: "Handmade warmth",
		description:
			"핸드라이팅 악센트와 파스텔 배경을 섞어 교사와 아이의 이야기가 살아있는 듯한 감성을 유지합니다.",
		detail:
			"Architects Daughter 서체, 노랑 하이라이트, 말풍선 요소로 스토리텔링 섹션에 온기를 더합니다.",
	},
] as const;

export const colorPalette = {
	brand: [
		{
			name: "Coral 500 (Primary)",
			token: "--brand-primary",
			value: "#FF4841",
			usage: "핵심 CTA 버튼, 아이콘 강조, 알림 배지",
		},
		{
			name: "Lavender 500 (Secondary)",
			token: "--brand-secondary",
			value: "#8157EC",
			usage: "보조 CTA, 탭 선택 상태, 하이라이트 텍스트",
		},
		{
			name: "Sun 400 (Accent)",
			token: "--brand-sunshine",
			value: "#FDD324",
			usage: "노란 하이라이트, 칩, 카드 헤더",
		},
		{
			name: "Seafoam 300",
			token: "--brand-mint",
			value: "#98D9D1",
			usage: "차분한 보조 배경, 긍정 상태, 아이콘 배경",
		},
		{
			name: "Ink 800",
			token: "--brand-navy",
			value: "#3E5067",
			usage: "본문 텍스트, 네비게이션, 카드 제목",
		},
	] as ColorToken[],
	neutrals: [
		{
			name: "Cloud 200",
			token: "--background",
			value: "#FAF8FF",
			usage: "전체 배경, Hero 섹션 배색",
		},
		{
			name: "Surface White",
			token: "--card",
			value: "#FFFFFF",
			usage: "카드, 패널, 모달",
		},
		{
			name: "Cloud 150",
			token: "--muted",
			value: "#F0EFF7",
			usage: "보조 섹션 배경, 인터랙션 hover",
		},
		{
			name: "Cloud 100",
			token: "--border",
			value: "#E8E8E8",
			usage: "카드 경계, 입력 필드 보더, 테이블 구분선",
		},
		{
			name: "Muted Grey",
			token: "--muted-foreground",
			value: "#646464A6",
			usage: "보조 본문, 캡션, 카드 설명 텍스트",
		},
	] as ColorToken[],
	feedback: [
		{
			name: "Info",
			token: "--info",
			value: "#5C7AEA",
			usage: "정보 배지, 안내 메시지",
		},
		{
			name: "Success",
			token: "--success",
			value: "#2EC5A5",
			usage: "성공 알림, 긍정 피드백",
		},
		{
			name: "Warning",
			token: "--warning",
			value: "#FFB347",
			usage: "마감 임박, 경고 라벨",
		},
		{
			name: "Destructive",
			token: "--destructive",
			value: "#E03B36",
			usage: "오류 상태, 파괴적 액션",
		},
	] as ColorToken[],
};

export const gradientTokens: GradientToken[] = [
	{
		name: "Petit Sunrise",
		token: "--gradient-sunrise",
		value: "linear-gradient(135deg, #FF4841 0%, #8157EC 55%, #FDD324 100%)",
		usage: "히어로 영역, 프라이머리 CTA, 강조 배너",
	},
	{
		name: "Cloud Walk",
		token: "--gradient-cloudwalk",
		value: "linear-gradient(120deg, #FAF8FF 5%, #F0EFF7 55%, #FFFFFF 100%)",
		usage: "섹션 구분 배경, 카드 강조, 폼 히어로 영역",
	},
];

export const typographyScale: TypographyToken[] = [
	{
		name: "Hero Display",
		token: "text-display",
		size: "clamp(3.5rem, 6vw, 4.5rem)",
		lineHeight: "1.1",
		usage: "히어로 헤드라인, 이벤트 페이지 메인 카피",
		sample: "아이의 하루가 빛나는 Petit 순간",
	},
	{
		name: "Section Title",
		token: "text-headline",
		size: "clamp(2.5rem, 4.5vw, 3.5rem)",
		lineHeight: "1.15",
		usage: "섹션 메인 타이틀, 랜딩 페이지 블록 타이틀",
		sample: "놀이와 창의가 만나는 Petit 클래스",
	},
	{
		name: "Feature Title",
		token: "text-title",
		size: "2.25rem",
		lineHeight: "1.2",
		usage: "카드/패널 주요 제목, 핵심 강조 문장",
		sample: "연령별 맞춤 활동 큐레이션",
	},
	{
		name: "Eyebrow Subtitle",
		token: "text-subtitle",
		size: "1.5rem",
		lineHeight: "1.35",
		usage: "보조 설명, 카드 서브 헤드, Intro 문장",
		sample: "교사와 학부모가 함께 만드는 루틴",
	},
	{
		name: "Body Large",
		token: "text-body-lg",
		size: "1.125rem",
		lineHeight: "1.7",
		usage: "프로그램 소개 본문, 랜딩 페이지 브리프",
		sample: "19px 본문 크기로 가독성과 안정감을 동시에 확보합니다.",
	},
	{
		name: "Body",
		token: "text-body",
		size: "1.0625rem",
		lineHeight: "1.65",
		usage: "일반 본문",
		sample: "Petit 커리큘럼은 아이의 호기심을 중심에 둡니다.",
	},
	{
		name: "Body Small",
		token: "text-body-sm",
		size: "0.9375rem",
		lineHeight: "1.6",
		usage: "폼 도움말, 카드 캡션, 배지 설명",
		sample: "상담 신청 시 24시간 이내 연락드립니다.",
	},
	{
		name: "Caption",
		token: "text-caption",
		size: "0.8125rem",
		lineHeight: "1.5",
		usage: "메타 데이터, 일정 레이블, 표 하단",
		sample: "Last updated 2025.11.01",
	},
];

export const spacingScale: ScaleToken[] = [
	{
		token: "space-3xs",
		value: "0.25rem",
		usage: "아이콘 배지, 버튼 아이콘 주변 여백 (4px)",
	},
	{
		token: "space-2xs",
		value: "0.375rem",
		usage: "칩 패딩, 태그 내부 간격 (6px)",
	},
	{
		token: "space-xs",
		value: "0.5rem",
		usage: "입력 필드 수평 여백, 모바일 카드 패딩 (8px)",
	},
	{
		token: "space-sm",
		value: "0.625rem",
		usage: "작은 버튼, 캡션 블록, 인풋 세로 여백 (10px)",
	},
	{
		token: "space-md",
		value: "1.25rem",
		usage: "카드 내부 패딩, 블록 간 기본 간격 (20px)",
	},
	{
		token: "space-lg",
		value: "1.875rem",
		usage: "콜아웃 카드, 히어로 콘텐츠 간격 (30px)",
	},
	{
		token: "space-xl",
		value: "2.5rem",
		usage: "섹션 상하 여백, 카드 그룹 간격 (40px)",
	},
	{
		token: "space-2xl",
		value: "3.75rem",
		usage: "히어로 상하 여백, 주요 전환 구간 (60px)",
	},
];

export const radiiScale: ScaleToken[] = [
	{
		token: "radius-xs",
		value: "0.1875rem",
		usage: "칩, 태그, 얇은 강조 라벨 (3px)",
	},
	{
		token: "radius-sm",
		value: "0.5rem",
		usage: "버튼, 입력 필드, 카드 탭 (8px)",
	},
	{
		token: "radius-md",
		value: "0.625rem",
		usage: "피처 타일, 리스트 카드 (10px)",
	},
	{
		token: "radius-lg",
		value: "0.75rem",
		usage: "콘텐츠 카드, 폼 래퍼 (12px)",
	},
	{
		token: "radius-pill",
		value: "9999px",
		usage: "CTA 필 버튼, 말풍선, 라벨",
	},
	{
		token: "radius-hero",
		value: "12.5rem",
		usage: "원형 이미지 마스크, 히어로 배경 블롭 (200px)",
	},
];

export const shadowTokens: ScaleToken[] = [
	{
		token: "shadow-soft",
		value: "4px 4px 20px rgba(62, 80, 103, 0.08)",
		usage: "서비스 카드, 리스트 아이템, 퀵 패널",
	},
	{
		token: "shadow-elevated",
		value: "10px 10px 18px rgba(255, 72, 65, 0.24)",
		usage: "프라이머리 CTA, 코랄 버튼 호버",
	},
	{
		token: "shadow-ambient",
		value: "0px 5px 12px rgba(0, 0, 0, 0.06)",
		usage: "네비게이션 바, 섹션 분리, 히어로 레이어",
	},
];

export const motionGuidelines = [
	{
		name: "Ease Out Soft",
		token: "cubic-bezier(0.16, 1, 0.3, 1)",
		usage: "버튼, 카드 호버",
	},
	{
		name: "Ease In Out",
		token: "cubic-bezier(0.4, 0, 0.2, 1)",
		usage: "페이지 전환, 탭",
	},
	{
		name: "Duration",
		token: "200ms - 350ms",
		usage: "대부분의 인터랙션",
	},
] as const;
