"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import type { FormState } from "./form-state";

const categoryEnum = z.enum(["announcements", "newsletter", "events"]);

const createPostSchema = z.object({
	title: z.string().min(2, "제목을 입력해 주세요."),
	slug: z
		.string()
		.trim()
		.optional()
		.transform((value) => (value && value.length > 0 ? value : undefined)),
	category: categoryEnum,
	summary: z
		.string()
		.optional()
		.transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
	contentMarkdown: z
		.string()
		.min(10, "본문은 최소 10자 이상 입력해 주세요."),
	heroImageUrl: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			return trimmed ? trimmed : undefined;
		}),
	heroImageAlt: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			return trimmed ? trimmed : undefined;
		}),
	publishAt: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			if (!trimmed) return undefined;
			const date = new Date(trimmed);
			return Number.isNaN(date.getTime()) ? undefined : date;
		}),
	audienceScope: z
		.enum(["public", "parents"])
		.default("public"),
	isHighlighted: z.boolean().default(false),
	attachments: z
		.array(
			z.object({
				label: z
					.string()
					.optional()
					.transform((value) => {
						const trimmed = value?.trim();
						return trimmed ? trimmed : undefined;
					}),
				url: z
					.string()
					.trim()
					.optional()
					.transform((value) => {
						const trimmed = value ?? "";
						if (trimmed.length === 0) {
							return undefined;
						}
						return trimmed;
					}),
			}),
		)
		.max(5),
});

function slugify(input: string) {
	const normalized = input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
	return normalized.length > 0 ? normalized : `post-${Date.now()}`;
}

function mapFormData(formData: FormData) {
	const attachmentLabels = formData.getAll("attachmentLabel") as string[];
	const attachmentUrls = formData.getAll("attachmentUrl") as (string | undefined)[];
	const attachments = attachmentLabels.map((label, index) => ({
		label,
		url: attachmentUrls[index],
	}));

	const raw = {
		title: (formData.get("title") as string | null) ?? "",
		slug: formData.get("slug") as string | undefined,
		category: ((formData.get("category") as string) ?? "announcements") as z.infer<typeof categoryEnum>,
		summary: formData.get("summary") as string | undefined,
		contentMarkdown: (formData.get("contentMarkdown") as string | null) ?? "",
		heroImageUrl: formData.get("heroImageUrl") as string | undefined,
		heroImageAlt: formData.get("heroImageAlt") as string | undefined,
		publishAt: formData.get("publishAt") as string | undefined,
		audienceScope: ((formData.get("audienceScope") as string) ?? "public") as "public" | "parents",
		isHighlighted: formData.get("isHighlighted") === "on",
		attachments,
	};

	return raw;
}

function markdownToParagraphs(markdown: string) {
	const normalized = markdown
		.replace(/\r\n/g, "\n")
		.replace(/[\t\f\v]/g, " ")
		.trim();

	const cleaned = normalized
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[[^\]]*\]\(([^)]*)\)/g, "$1")
		.replace(/[`*_#>~-]/g, "");

	const paragraphs = cleaned
		.split(/\n{2,}/)
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph.length > 0);

	return JSON.stringify(paragraphs.length > 0 ? paragraphs : [cleaned]);
}

export async function createNewsPostAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return {
			status: "error",
			message: "관리자 권한이 필요합니다.",
		};
	}

	const parsed = createPostSchema.safeParse(mapFormData(formData));

	if (!parsed.success) {
		return {
			status: "error",
			message: "입력값을 확인해 주세요.",
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	const data = parsed.data;

	const slug = data.slug ? slugify(data.slug) : slugify(data.title);
	const contentJson = markdownToParagraphs(data.contentMarkdown);

	try {
		const inserted = await db`
			INSERT INTO news_posts (
				slug,
				title,
				category,
				summary,
				content,
				hero_image_url,
				hero_image_alt,
				publish_at,
				is_highlighted,
				audience_scope,
				created_by
			) VALUES (
				${slug},
				${data.title},
				${data.category},
				${data.summary ?? null},
				${contentJson},
				${data.heroImageUrl ?? null},
				${data.heroImageAlt ?? null},
				${data.publishAt ?? null},
				${data.isHighlighted},
				${data.audienceScope},
				${session.user?.id ?? null}
			)
			RETURNING id
		`;

		const postId = inserted.rows[0]?.id as string | undefined;

		if (!postId) {
			throw new Error("게시글 생성에 실패했습니다.");
		}

		const validAttachments = data.attachments.filter(
			(attachment) => attachment.url && attachment.url.trim().length > 0,
		);

		for (const attachment of validAttachments) {
			await db`
				INSERT INTO news_attachments (post_id, file_url, label)
				VALUES (${postId}, ${attachment.url}, ${attachment.label ?? null})
			`;
		}

		revalidatePath("/admin");
		revalidatePath("/news");
		revalidatePath("/");

		return {
			status: "success",
			message: "게시글이 등록되었습니다.",
		};
	} catch (error) {
		console.error("[createNewsPostAction]", error);
		return {
			status: "error",
			message: "게시글 저장 중 오류가 발생했습니다.",
		};
	}
}

export async function deleteNewsPostAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return {
			status: "error",
			message: "관리자 권한이 필요합니다.",
		};
	}

	const postId = formData.get("postId") as string | null;

	if (!postId) {
		return {
			status: "error",
			message: "삭제할 게시글을 찾을 수 없습니다.",
		};
	}

	try {
		await db`DELETE FROM news_attachments WHERE post_id = ${postId}`;
		await db`DELETE FROM news_posts WHERE id = ${postId}`;

		revalidatePath("/admin");
		revalidatePath("/news");
		revalidatePath("/");

		return {
			status: "success",
			message: "게시글을 삭제했습니다.",
		};
	} catch (error) {
		console.error("[deleteNewsPostAction]", error);
		return {
			status: "error",
			message: "게시글 삭제 중 문제가 발생했습니다.",
		};
	}
}
