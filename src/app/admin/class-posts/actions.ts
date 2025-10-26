"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { initialFormState, type FormState } from "../form-state";

const createClassPostSchema = z.object({
	classroomId: z.string().uuid({ message: "반을 선택해 주세요." }),
	title: z.string().min(2, "제목을 입력해 주세요."),
	summary: z
		.string()
		.optional()
		.transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
	contentMarkdown: z
		.string()
		.min(5, "본문을 입력해 주세요."),
	publishAt: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			if (!trimmed) return undefined;
			const date = new Date(trimmed);
			return Number.isNaN(date.getTime()) ? undefined : date;
		}),
	attachments: z
		.array(
			z.object({
				label: z
					.string()
					.optional()
					.transform((value) => {
						const trimmed = value?.trim();
						return trimmed && trimmed.length > 0 ? trimmed : undefined;
					}),
				url: z
					.string()
					.optional()
					.transform((value) => {
						const trimmed = value?.trim();
						return trimmed && trimmed.length > 0 ? trimmed : undefined;
					}),
			}),
		)
		.max(5),
});

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

function mapFormData(formData: FormData) {
	const attachmentLabels = formData.getAll("attachmentLabel") as string[];
	const attachmentUrls = formData.getAll("attachmentUrl") as (string | undefined)[];

	const attachments = attachmentLabels.map((label, index) => ({
		label,
		url: attachmentUrls[index],
	}));

	return {
		classroomId: String(formData.get("classroomId") ?? ""),
		title: (formData.get("title") as string | null) ?? "",
		summary: formData.get("summary") as string | undefined,
		contentMarkdown: (formData.get("contentMarkdown") as string | null) ?? "",
		publishAt: formData.get("publishAt") as string | undefined,
		attachments,
	};
}

export async function createClassPostAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return {
			status: "error",
			message: "관리자 권한이 필요합니다.",
		};
	}

	const parsed = createClassPostSchema.safeParse(mapFormData(formData));
	if (!parsed.success) {
		return {
			status: "error",
			message: "입력값을 확인해 주세요.",
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	const data = parsed.data;
	const publishAtValue = data.publishAt ? data.publishAt.toISOString() : null;

	try {
		const content = markdownToParagraphs(data.contentMarkdown);

		const inserted = await db`
			INSERT INTO class_posts (classroom_id, author_id, title, summary, content, publish_at)
			VALUES (${data.classroomId}, ${session.user.id}, ${data.title}, ${data.summary ?? null}, ${content}, ${publishAtValue})
			RETURNING id
		`;

		const postId = inserted.rows[0]?.id as string | undefined;

		if (!postId) {
			throw new Error("게시글 저장에 실패했습니다.");
		}

		const attachments = data.attachments.filter((attachment) => attachment.url);

		for (const attachment of attachments) {
			await db`
				INSERT INTO class_post_attachments (post_id, file_url, label)
				VALUES (${postId}, ${attachment.url}, ${attachment.label ?? null})
			`;
		}

		revalidatePath("/admin/class-posts");
		revalidatePath("/parents");
		revalidatePath("/parents/posts");

		return {
			status: "success",
			message: "반 소식을 등록했습니다.",
		};
	} catch (error) {
		console.error("[createClassPostAction]", error);
		return {
			status: "error",
			message: "게시글 저장 중 오류가 발생했습니다.",
		};
	}
}

export async function deleteClassPostAction(_: FormState, formData: FormData): Promise<FormState> {
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
		await db`DELETE FROM class_post_attachments WHERE post_id = ${postId}`;
		await db`DELETE FROM class_posts WHERE id = ${postId}`;

		revalidatePath("/admin/class-posts");
		revalidatePath("/parents");
		revalidatePath("/parents/posts");

		return {
			status: "success",
			message: "반 소식을 삭제했습니다.",
		};
	} catch (error) {
		console.error("[deleteClassPostAction]", error);
		return {
			status: "error",
			message: "삭제 중 문제가 발생했습니다.",
		};
	}
}

export { initialFormState };
export type { FormState };
