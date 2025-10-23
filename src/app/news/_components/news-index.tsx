import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	newsCategories,
	newsItems,
	type NewsCategoryKey,
} from "@/lib/data/news";

type NewsIndexProps = {
	activeCategoryKey?: NewsCategoryKey;
};

export function NewsIndex({ activeCategoryKey }: NewsIndexProps) {
	const activeCategory = activeCategoryKey
		? newsCategories.find((category) => category.key === activeCategoryKey)
		: undefined;

	const filteredNews = activeCategory
		? newsItems.filter((item) => item.category === activeCategory.key)
		: newsItems;

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:px-10 lg:px-12">
					<div className="space-y-3">
						<Badge variant="outline" className="w-fit">
							알림마당
						</Badge>
						<h1 className="font-heading text-[clamp(2.5rem,4vw,3.5rem)] leading-tight">
							학부모와 함께 나누는 최신 소식
						</h1>
						<p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
							입학, 커리큘럼, 행사 소식을 빠르게 업데이트하고 PWA 알림과 연동해 긴급 안내도 모바일로 받을 수 있도록 준비하고 있습니다.
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button
							variant={activeCategory ? "outline" : "default"}
							asChild
							size="sm"
						>
							<Link href="/news">전체 보기</Link>
						</Button>
						{newsCategories.map((category) => (
							<Button
								key={category.key}
								variant={activeCategory?.key === category.key ? "default" : "outline"}
								size="sm"
								asChild
							>
								<Link href={`/news/${category.key}`}>{category.label}</Link>
							</Button>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-12">
				{activeCategory ? (
					<header className="space-y-3">
						<h2 className="font-heading text-2xl">{activeCategory.label}</h2>
						<p className="text-sm leading-relaxed text-muted-foreground">
							{activeCategory.description}
						</p>
					</header>
				) : null}

				<div className="grid gap-6 md:grid-cols-2">
					{filteredNews.map((item) => (
						<Card key={item.slug} className="h-full border-[var(--border)] bg-white/85 backdrop-blur">
							<CardHeader className="space-y-3">
								<Badge variant="ghost" className="w-fit text-xs text-[var(--brand-secondary)]">
									{newsCategories.find((category) => category.key === item.category)?.label ??
										item.category}
								</Badge>
								<CardTitle className="text-xl leading-snug text-[var(--brand-navy)]">
									{item.title}
								</CardTitle>
								<CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
									{item.date}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
								<Button variant="link" className="px-0 text-[var(--brand-secondary)]" asChild>
									<Link href={`/news/${item.slug}`}>자세히 보기</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
