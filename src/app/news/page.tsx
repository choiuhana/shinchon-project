import { NewsIndex } from "./_components/news-index";
import { newsCategories, type NewsCategoryKey } from "@/lib/data/news";

type NewsPageProps = {
	searchParams?: Promise<{
		category?: string;
	}>;
};

export const metadata = {
	title: "알림마당 | 신촌몬테소리유치원",
	description:
		"공지사항, 가정통신문, 행사 소식을 한곳에서 확인하세요. 상담 예약과 학사 일정 안내도 함께 제공합니다.",
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
	const resolvedParams = searchParams ? await searchParams : {};
	const selectedCategory = resolvedParams.category ?? "";
	const activeCategory =
		selectedCategory !== ""
			? newsCategories.find((category) => category.key === selectedCategory)
			: undefined;
	const activeCategoryKey: NewsCategoryKey | undefined = activeCategory?.key;

	return <NewsIndex activeCategoryKey={activeCategoryKey} />;
}
