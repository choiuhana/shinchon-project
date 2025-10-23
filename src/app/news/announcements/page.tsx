import type { Metadata } from "next";

import { NewsIndex } from "../_components/news-index";

export const metadata: Metadata = {
	title: "공지사항 | 신촌몬테소리유치원 알림마당",
	description:
		"입학 일정, 원 운영, 주요 정책 변경 등 신촌몬테소리유치원의 공식 공지사항을 확인하세요.",
};

export default function AnnouncementsPage() {
	return <NewsIndex activeCategoryKey="announcements" />;
}
