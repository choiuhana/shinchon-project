import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { newsCategories } from "@/lib/data/news";
import { getNewsBySlug } from "@/lib/data/news-repository";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
	if (!date) {
		return "";
	}
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

type NewsDetailPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const newsItem = await getNewsBySlug(slug);

	if (!newsItem) {
		return {
			title: "알림마당 | 신촌몬테소리유치원",
		};
	}

	return {
		title: `${newsItem.title} | 알림마당`,
		description: newsItem.summary ?? newsItem.content[0],
	};
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
	const { slug } = await params;

	const newsItem = await getNewsBySlug(slug);

	if (!newsItem) {
		notFound();
	}

	const category = newsCategories.find((item) => item.key === newsItem.category);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 sm:px-10 lg:px-12">
					<div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-[var(--brand-primary)]">
							홈
						</Link>
						<span>/</span>
						<Link href="/news" className="hover:text-[var(--brand-primary)]">
							알림마당
						</Link>
						{category ? (
							<>
								<span>/</span>
								<Link href={category.href} className="hover:text-[var(--brand-primary)]">
									{category.label}
								</Link>
							</>
						) : null}
					</div>

					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-4">
							{category ? (
								<Badge variant="outline" className="text-xs text-[var(--brand-secondary)]">
									{category.label}
								</Badge>
							) : null}
							<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
								{formatDate(newsItem.publishAt ?? newsItem.createdAt)}
							</span>
						</div>
						<h1 className="font-heading text-[clamp(2.25rem,4vw,3rem)] leading-tight">
							{newsItem.title}
						</h1>
						{newsItem.summary ? (
							<p className="text-base leading-relaxed text-muted-foreground">{newsItem.summary}</p>
						) : null}
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 sm:px-10 lg:px-12">
				<article className="space-y-6 text-base leading-loose text-muted-foreground">
					{newsItem.content.map((paragraph, index) => (
						<p key={`${newsItem.id}-paragraph-${index}`}>{paragraph}</p>
					))}
				</article>

				{newsItem.attachments.length > 0 ? (
					<div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-6 py-6 text-sm text-muted-foreground">
						<h3 className="font-semibold text-[var(--brand-navy)]">첨부 자료</h3>
						<ul className="mt-3 list-disc space-y-2 pl-4">
							{newsItem.attachments.map((attachment) => (
								<li key={attachment.id}>
									<Link
										href={attachment.fileUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[var(--brand-primary)] underline-offset-4 hover:underline"
									>
										{attachment.label ?? "첨부 파일"}
									</Link>
								</li>
							))}
						</ul>
					</div>
				) : null}

				<div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-6 py-6 text-sm text-muted-foreground">
					<span>추가 문의나 증빙 서류가 필요하시면 유치원으로 바로 연락 주세요.</span>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/news">목록으로 돌아가기</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
