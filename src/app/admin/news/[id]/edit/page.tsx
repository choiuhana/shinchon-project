import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { newsCategories } from "@/lib/data/news";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { EditPostForm, type NewsPostFormValues } from "../../../_components/create-post-form";

type EditNewsPostPageProps = {
	params: Promise<{ id: string }>;
};

function parseContent(raw: unknown): string {
	if (!raw) return "";
	if (Array.isArray(raw)) {
		return raw.map((item) => String(item)).join("\n\n");
	}
	if (typeof raw === "string") {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => String(item)).join("\n\n");
			}
			return String(parsed);
		} catch {
			return raw;
		}
	}
	return "";
}

async function getNewsPostById(id: string) {
	const { rows } = await db`
		SELECT
			np.id,
			np.slug,
			np.title,
			np.category,
			np.summary,
			np.content,
			np.publish_at AS "publishAt",
			np.hero_image_url AS "heroImageUrl",
			np.hero_image_alt AS "heroImageAlt",
			np.is_highlighted AS "isHighlighted",
			np.audience_scope AS "audienceScope",
			COALESCE(
				json_agg(
					json_build_object(
						'label', na.label,
						'url', na.file_url
					)
				) FILTER (WHERE na.id IS NOT NULL),
				'[]'
			) AS attachments
		FROM news_posts np
		LEFT JOIN news_attachments na ON na.post_id = np.id
		WHERE np.id = ${id}
		GROUP BY np.id
	`;

	if (!rows.length) {
		return null;
	}

	return rows[0] as {
		id: string;
		slug: string | null;
		title: string;
		category: string;
		summary: string | null;
		content: unknown;
		publishAt: Date | null;
		heroImageUrl: string | null;
		heroImageAlt: string | null;
		isHighlighted: boolean;
		audienceScope: string;
		attachments: { label?: string | null; url?: string | null }[];
	};
}

export default async function EditNewsPostPage({ params }: EditNewsPostPageProps) {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		redirect("/member/login?redirect=/admin");
	}

	const { id } = await params;
	const post = await getNewsPostById(id);
	if (!post) {
		notFound();
	}

	const initialValues: NewsPostFormValues = {
		postId: post.id,
		title: post.title,
		category: post.category,
		summary: post.summary,
		contentMarkdown: parseContent(post.content),
		publishAt: post.publishAt ? post.publishAt.toISOString() : null,
		heroImageUrl: post.heroImageUrl,
		heroImageAlt: post.heroImageAlt,
		isHighlighted: post.isHighlighted,
		audienceScope: post.audienceScope,
		slug: post.slug,
		attachments: Array.isArray(post.attachments) ? post.attachments : [],
	};

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12 sm:px-10 lg:px-12">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
						<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">게시글 수정</h1>
						<p className="text-sm text-muted-foreground">기존 공지/가정통신문 콘텐츠를 안전하게 수정하세요.</p>
					</div>
					<Button variant="outline" asChild>
						<Link href="/admin">← 관리자 홈으로</Link>
					</Button>
				</div>

				<EditPostForm categories={newsCategories} initialValues={initialValues} />
			</section>
		</div>
	);
}
