export type NewsCategoryKey = "announcements" | "newsletter" | "events";

export interface NewsCategory {
	key: NewsCategoryKey;
	label: string;
	description: string;
	href: string;
}

export interface NewsItem {
	slug: string;
	category: NewsCategoryKey;
	title: string;
	date: string;
	summary: string;
	content: string[];
	heroImageAlt?: string;
}

export const newsCategories: NewsCategory[] = [
	{
		key: "announcements",
		label: "공지사항",
		description: "입학, 일정, 운영과 관련된 주요 공지를 안내합니다.",
		href: "/news/announcements",
	},
	{
		key: "newsletter",
		label: "가정통신문",
		description: "가정과 함께 나눌 월간 프로젝트 소식과 준비물을 전합니다.",
		href: "/news/newsletter",
	},
	{
		key: "events",
		label: "행사",
		description: "유치원 행사와 워크숍 일정을 미리 확인할 수 있습니다.",
		href: "/news/events",
	},
];

/**
 * TODO: 게시판 API 연결 후 실제 데이터로 치환 예정.
 *      (Ref: 신촌몬테소리유치원_사이트맵_및_페이지구조.md:91-112)
 */
export const newsItems: NewsItem[] = [
	{
		slug: "open-house-2025",
		category: "announcements",
		title: "2025년 1학기 입학 설명회 예약 안내",
		date: "2024.11.10",
		summary: "1월 열리는 설명회 일정과 예약 방법을 안내드립니다.",
		content: [
			"2025학년도 1학기 입학 설명회가 1월 13일(월) 오후 2시에 본원 다목적실에서 진행됩니다.",
			"설명회에서는 몬테소리 커리큘럼, 반 구성, 원 생활에 필요한 준비물을 상세히 소개합니다.",
			"참석을 원하시는 보호자께서는 온라인 상담 예약 또는 대표번호(02-324-0671)로 예약해 주세요.",
		],
		heroImageAlt: "설명회가 열리는 신촌몬테소리유치원 강당",
	},
	{
		slug: "ecology-november",
		category: "newsletter",
		title: "11월 생태 프로젝트 ‘낙엽 속 작은 생명’",
		date: "2024.10.25",
		summary: "11월 프로젝트 주제와 가정 연계 활동을 안내합니다.",
		content: [
			"11월의 생태 프로젝트는 ‘낙엽 속 작은 생명’을 주제로 진행됩니다.",
			"아이들은 정원과 이대 캠퍼스 숲길을 탐방하며 분해자 생물을 관찰하고 기록합니다.",
			"가정에서는 나뭇잎 스케치북(배포 예정)을 활용해 함께 관찰 기록을 남겨 주세요.",
		],
		heroImageAlt: "아이들이 낙엽을 관찰하며 노트에 기록하는 모습",
	},
	{
		slug: "petit-atelier-exhibition",
		category: "events",
		title: "Petit Atelier 전시회 & 가족 워크숍",
		date: "2024.10.12",
		summary: "정기 Atelier 프로젝트 작품 전시와 가족 참여 워크숍 일정입니다.",
		content: [
			"Petit Atelier 프로젝트의 결과물을 전시하는 ‘컬러의 리듬’ 전시회가 12월 6~7일에 열립니다.",
			"가족 워크숍 신청은 11월 15일부터 온라인으로 가능하며, 회차별 선착순 12가족을 모십니다.",
			"전시 기간 동안 Atelier 교사와의 1:1 상담 부스가 마련되니 많은 참여 바랍니다.",
		],
		heroImageAlt: "전시된 아이들의 그림과 가족이 함께 체험하는 모습",
	},
];

export const homepageNewsPreview = newsItems.slice(0, 3);

export function getNewsBySlug(slug: string) {
	return newsItems.find((item) => item.slug === slug);
}
