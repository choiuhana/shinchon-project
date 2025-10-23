import { NewsIndex } from "./_components/news-index";
import { newsCategories, type NewsCategoryKey } from "@/lib/data/news";

type NewsPageProps = {
	searchParams?: {
		category?: string;
	};
};

export const metadata = {
	title: "알림마당 | 신촌몬테소리유치원",
	description:
		"공지사항, 가정통신문, 행사 소식을 한곳에서 확인하세요. 상담 예약과 학사 일정 안내도 함께 제공합니다.",
};

export default function NewsPage({ searchParams }: NewsPageProps) {
	const selectedCategory = searchParams?.category ?? "";
	const activeCategory =
		selectedCategory !== ""
			? newsCategories.find((category) => category.key === selectedCategory)
			: undefined;
	const activeCategoryKey: NewsCategoryKey | undefined = activeCategory?.key;

	return <NewsIndex activeCategoryKey={activeCategoryKey} />;
}
