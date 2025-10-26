import { cache } from "react";

import { db } from "@/lib/db";

import type { NewsCategoryKey, NewsPost, NewsAttachment } from "./news";

function parseContent(value: unknown): string[] {
	if (!value) {
		return [];
	}

	if (Array.isArray(value)) {
		return value.map((item) => String(item)).filter((item) => item.length > 0);
	}

	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => String(item)).filter((item) => item.length > 0);
			}
			return [parsed].map((item) => String(item)).filter((item) => item.length > 0);
		} catch {
			return [value].map((item) => String(item)).filter((item) => item.length > 0);
		}
	}

	return [];
}

function parseAttachments(value: unknown): NewsAttachment[] {
	if (!value) {
		return [];
	}

	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => ({
					id: String((item as { id?: string }).id ?? crypto.randomUUID()),
					label: "label" in (item as Record<string, unknown>)
						? ((item as { label?: string | null }).label ?? null)
						: null,
					fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ""),
				}));
			}
			return [];
		} catch {
			return [];
		}
	}

	if (Array.isArray(value)) {
		return value.map((item) => ({
			id: String((item as { id?: string }).id ?? crypto.randomUUID()),
			label:
				"label" in (item as Record<string, unknown>)
					? ((item as { label?: string | null }).label ?? null)
					: null,
			fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ""),
		}));
	}

	return [];
}

function mapRowToNewsPost(row: Record<string, unknown>): NewsPost {
	return {
		id: String(row.id),
		slug: String(row.slug),
		category: row.category as NewsCategoryKey,
		title: String(row.title),
		summary: (row.summary as string | null) ?? null,
		content: parseContent(row.content),
		publishAt: row.publishAt ? new Date(String(row.publishAt)) : null,
		createdAt: new Date(String(row.createdAt)),
		updatedAt: new Date(String(row.updatedAt)),
		heroImageUrl: (row.heroImageUrl as string | null) ?? null,
		heroImageAlt: (row.heroImageAlt as string | null) ?? null,
		isHighlighted: Boolean(row.isHighlighted),
		audienceScope: String(row.audienceScope),
		attachments: parseAttachments(row.attachments).filter((attachment) => attachment.fileUrl.length > 0),
	};
}

async function queryNewsPosts(options?: {
	category?: NewsCategoryKey;
	limit?: number;
	highlightedOnly?: boolean;
}): Promise<NewsPost[]> {
	const category = options?.category ?? null;
	const limit = options?.limit ?? 50;
	const highlightedOnly = options?.highlightedOnly ?? false;

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
			np.created_at AS "createdAt",
			np.updated_at AS "updatedAt",
			np.is_highlighted AS "isHighlighted",
			np.audience_scope AS "audienceScope",
			COALESCE(
				json_agg(
					json_build_object(
						'id', na.id,
						'label', na.label,
						'fileUrl', na.file_url
					)
				) FILTER (WHERE na.id IS NOT NULL),
				'[]'
			) AS attachments
		FROM news_posts np
		LEFT JOIN news_attachments na ON na.post_id = np.id
		WHERE
			(${category}::text IS NULL OR np.category = ${category})
			AND (${highlightedOnly}::boolean = false OR np.is_highlighted = true)
		GROUP BY np.id
		ORDER BY COALESCE(np.publish_at, np.created_at) DESC, np.title ASC
		LIMIT ${limit}
	`;

	return rows.map((row) => mapRowToNewsPost(row as Record<string, unknown>));
}

async function queryNewsPostBySlug(slug: string): Promise<NewsPost | null> {
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
			np.created_at AS "createdAt",
			np.updated_at AS "updatedAt",
			np.is_highlighted AS "isHighlighted",
			np.audience_scope AS "audienceScope",
			COALESCE(
				json_agg(
					json_build_object(
						'id', na.id,
						'label', na.label,
						'fileUrl', na.file_url
					)
				) FILTER (WHERE na.id IS NOT NULL),
				'[]'
			) AS attachments
		FROM news_posts np
		LEFT JOIN news_attachments na ON na.post_id = np.id
		WHERE np.slug = ${slug}
		GROUP BY np.id
	`;

	return rows.length > 0 ? mapRowToNewsPost(rows[0] as Record<string, unknown>) : null;
}

export const getNewsList = cache(async (options?: {
	category?: NewsCategoryKey;
	limit?: number;
	highlightedOnly?: boolean;
}) => queryNewsPosts(options));

export const getHighlightedNews = cache(async (limit = 3) => {
	return queryNewsPosts({ highlightedOnly: true, limit });
});

export const getNewsBySlug = cache(queryNewsPostBySlug);
