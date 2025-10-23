import type { Metadata } from "next";

import { NewsIndex } from "../_components/news-index";

export const metadata: Metadata = {
	title: "가정통신문 | 신촌몬테소리유치원 알림마당",
	description:
		"월간 프로젝트 소식과 가정 연계 활동 안내를 가정통신문으로 받아보세요.",
};

export default function NewsletterPage() {
	return <NewsIndex activeCategoryKey="newsletter" />;
}
