export type NewsCategoryKey = "announcements" | "newsletter" | "events";

export interface NewsCategory {
	key: NewsCategoryKey;
	label: string;
	description: string;
	href: string;
}

export type NewsAttachment = {
	id: string;
	label?: string | null;
	fileUrl: string;
};

export interface NewsPost {
	id: string;
	slug: string;
	category: NewsCategoryKey;
	title: string;
	summary?: string | null;
	content: string[];
	publishAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	heroImageUrl?: string | null;
	heroImageAlt?: string | null;
	isHighlighted: boolean;
	audienceScope: string;
	attachments: NewsAttachment[];
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
