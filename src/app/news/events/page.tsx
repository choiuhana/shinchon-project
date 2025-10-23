import type { Metadata } from "next";

import { NewsIndex } from "../_components/news-index";

export const metadata: Metadata = {
	title: "행사 | 신촌몬테소리유치원 알림마당",
	description:
		"전시회, 워크숍, 학부모 참여 프로그램 등 다양한 행사 일정을 미리 확인하세요.",
};

export default function EventsPage() {
	return <NewsIndex activeCategoryKey="events" />;
}
