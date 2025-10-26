import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { newsCategories } from "@/lib/data/news";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

import { CreatePostForm } from "./_components/create-post-form";
import { DeletePostButton } from "./_components/delete-post-button";

type AdminPageProps = {
	searchParams?: Promise<{
		category?: string;
	}>;
};

type Attachment = {
	id: string;
	label?: string | null;
	fileUrl: string;
};

type AdminPost = {
	id: string;
	title: string;
	slug: string;
	category: string;
	summary?: string | null;
	content: string[];
	heroImageUrl?: string | null;
	heroImageAlt?: string | null;
	publishAt?: Date | null;
	isHighlighted: boolean;
	audienceScope: string;
	createdAt: Date;
	updatedAt: Date;
	attachments: Attachment[];
};

export const metadata: Metadata = {
	title: "관리자 콘솔 | 신촌몬테소리유치원",
	description: "공지사항, 가정통신문, 행사 소식을 관리하는 관리자 전용 콘솔입니다.",
};

const CATEGORY_FILTERS = [
	{ key: "all", label: "전체" },
	...newsCategories.map((category) => ({
		key: category.key,
		label: category.label,
	})),
] as const;

function formatDate(value: Date | null | undefined) {
	if (!value) return "—";
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(value);
}

function audienceLabel(scope: string) {
	switch (scope) {
		case "parents":
			return "학부모 전용";
		default:
			return "전체 공개";
	}
}

function safeParseContent(raw: unknown): string[] {
	if (!raw) return [];
	if (Array.isArray(raw)) {
		return raw.map((item) => String(item)).filter((item) => item.length > 0);
	}
	if (typeof raw === "string") {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => String(item)).filter((item) => item.length > 0);
			}
			return [parsed].map((item) => String(item)).filter((item) => item.length > 0);
		} catch {
			return [raw].map((item) => String(item)).filter((item) => item.length > 0);
		}
	}
	return [];
}

function parseAttachments(raw: unknown): Attachment[] {
	if (!raw) return [];
	if (typeof raw === "string") {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => ({
					id: String(item.id),
					label: "label" in item ? (item as { label?: string | null }).label ?? null : null,
					fileUrl: String((item as { fileUrl: string }).fileUrl),
				}));
			}
			return [];
		} catch {
			return [];
		}
	}
	if (Array.isArray(raw)) {
		return raw.map((item, index) => ({
			id: String((item as { id?: string }).id ?? `attachment-${index}`),
			label: "label" in item ? (item as { label?: string | null }).label ?? null : null,
			fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ""),
		})).filter((attachment) => attachment.fileUrl.length > 0);
	}
	return [];
}

async function getAdminPosts(): Promise<AdminPost[]> {
	const { rows } = await db`
		SELECT
			np.id,
			np.slug,
			np.title,
			np.category,
			np.summary,
			np.content,
			np.hero_image_url AS "heroImageUrl",
			np.hero_image_alt AS "heroImageAlt",
			np.publish_at AS "publishAt",
			np.is_highlighted AS "isHighlighted",
			np.audience_scope AS "audienceScope",
			np.created_at AS "createdAt",
			np.updated_at AS "updatedAt",
			COALESCE(
				json_agg(
					json_build_object(
						'id', na.id,
						'label', na.label,
						'fileUrl', na.file_url
					)
				) FILTER (WHERE na.id IS NOT NULL),
				'[]'::json
			) AS "attachments"
		FROM news_posts np
		LEFT JOIN news_attachments na ON na.post_id = np.id
		GROUP BY np.id
		ORDER BY COALESCE(np.publish_at, np.created_at) DESC, np.title ASC
	`;

	return rows.map((row: Record<string, unknown>) => ({
		id: String(row.id),
		title: String(row.title),
		slug: String(row.slug),
		category: String(row.category),
		summary: (row.summary as string | null) ?? null,
		content: safeParseContent(row.content),
		heroImageUrl: (row.heroImageUrl as string | null) ?? null,
		heroImageAlt: (row.heroImageAlt as string | null) ?? null,
		publishAt: row.publishAt ? new Date(String(row.publishAt)) : null,
		isHighlighted: Boolean(row.isHighlighted),
		audienceScope: String(row.audienceScope),
		createdAt: new Date(String(row.createdAt)),
		updatedAt: new Date(String(row.updatedAt)),
		attachments: parseAttachments(row.attachments),
	}));
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
	const params = searchParams ? await searchParams : {};
	const activeCategory =
		CATEGORY_FILTERS.find((filter) => filter.key === params?.category)?.key ?? "all";

	const posts = await getAdminPosts();
	const filteredPosts =
		activeCategory === "all"
			? posts
			: posts.filter((post) => post.category === activeCategory);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
				<header className="space-y-6">
					<div className="space-y-2">
						<p className="font-medium uppercase tracking-[0.3em] text-[var(--brand-secondary)]">
							Admin Console
						</p>
						<h1 className="font-heading text-[clamp(2.25rem,3vw,3rem)] leading-tight">콘텐츠 관리</h1>
						<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
							공지사항, 가정통신문, 행사 소식을 등록하고 관리할 수 있습니다. 게시 후에는 뉴스 페이지와 메인
							미리보기가 자동으로 갱신됩니다.
						</p>
					</div>
				</header>

				<CreatePostForm categories={newsCategories} />

				<section className="space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h2 className="text-lg font-semibold text-[var(--brand-navy)]">등록된 게시글</h2>
							<p className="text-sm text-muted-foreground">
								최근 게시글부터 정렬됩니다. 카테고리를 선택하여 필터링할 수 있습니다.
							</p>
						</div>

						<nav className="flex flex-wrap items-center gap-2">
							{CATEGORY_FILTERS.map((filter) => {
								const isActive = filter.key === activeCategory;
								const search = filter.key === "all" ? "" : `?category=${filter.key}`;
								return (
									<Link
										key={filter.key}
										href={`/admin${search}`}
										className={cn(
											"rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-colors",
											isActive
												? "bg-[var(--brand-primary)] text-white shadow-[var(--shadow-soft)]"
												: "border border-[var(--border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
										)}
									>
										{filter.label}
										<span className="ml-2 inline-block min-w-8 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
											{filter.key === "all"
												? posts.length
												: posts.filter((post) => post.category === filter.key).length}
										</span>
									</Link>
								);
							})}
						</nav>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>카테고리</TableHead>
								<TableHead>제목</TableHead>
								<TableHead>요약</TableHead>
								<TableHead>공개 범위</TableHead>
								<TableHead>게시 예정일</TableHead>
								<TableHead>작성</TableHead>
								<TableHead>수정</TableHead>
								<TableHead className="text-right">관리</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredPosts.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
										선택된 조건에 해당하는 게시글이 없습니다.
									</TableCell>
								</TableRow>
							) : (
								filteredPosts.map((post) => (
									<TableRow key={post.id}>
										<TableCell className="font-medium">
											{newsCategories.find((category) => category.key === post.category)?.label ??
												post.category}
											{post.isHighlighted ? (
												<span className="ml-2 rounded-[var(--radius-pill)] bg-[rgba(129,87,236,0.12)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-primary)]">
													미리보기
												</span>
											) : null}
										</TableCell>
										<TableCell className="max-w-[260px] truncate">
											<div className="flex flex-col">
												<span className="font-semibold text-[var(--brand-navy)]">{post.title}</span>
												<Link
													href={`/news/${post.slug}`}
													className="text-xs text-[var(--brand-primary)] underline-offset-4 hover:underline"
												>
													/news/{post.slug}
												</Link>
												{post.attachments.length > 0 ? (
													<ul className="mt-1 space-y-1 text-xs text-muted-foreground">
														{post.attachments.map((attachment) => (
															<li key={attachment.id}>
																{attachment.label ? `${attachment.label} · ` : ""}
																<a
																	href={attachment.fileUrl}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-[var(--brand-primary)] underline-offset-4 hover:underline"
																>
																	첨부
																</a>
															</li>
														))}
													</ul>
												) : null}
											</div>
										</TableCell>
										<TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
											{post.summary ?? post.content[0] ?? "—"}
										</TableCell>
										<TableCell>{audienceLabel(post.audienceScope)}</TableCell>
										<TableCell>{formatDate(post.publishAt ?? null)}</TableCell>
										<TableCell>{formatDate(post.createdAt)}</TableCell>
										<TableCell>{formatDate(post.updatedAt)}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button variant="outline" size="sm" asChild>
													<Link href={`/news/${post.slug}`} target="_blank">
														미리보기
													</Link>
												</Button>
												<DeletePostButton postId={post.id} />
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
						<TableCaption>
							총 {posts.length}건의 게시글이 등록되어 있습니다. 삭제 시 첨부 자료도 함께 제거됩니다.
						</TableCaption>
					</Table>
				</section>
			</section>
		</div>
	);
}
