"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { initialFormState, type FormState } from "../form-state";

const resourceSchema = z.object({
	title: z.string().min(2, "제목을 입력해 주세요."),
	description: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			return trimmed && trimmed.length > 0 ? trimmed : undefined;
		}),
	category: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			return trimmed && trimmed.length > 0 ? trimmed : undefined;
		}),
	resourceType: z.enum(["form", "committee"]),
	fileUrl: z
		.string()
		.url("유효한 URL을 입력해 주세요."),
	publishedAt: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			if (!trimmed) return undefined;
			const date = new Date(trimmed);
			return Number.isNaN(date.getTime()) ? undefined : date;
		}),
});

export async function createParentResourceAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return { status: "error", message: "관리자 권한이 필요합니다." };
	}

	const parsed = resourceSchema.safeParse({
		title: formData.get("title")?.toString(),
		description: formData.get("description")?.toString(),
		category: formData.get("category")?.toString(),
		resourceType: formData.get("resourceType")?.toString(),
		fileUrl: formData.get("fileUrl")?.toString(),
		publishedAt: formData.get("publishedAt")?.toString(),
	});

	if (!parsed.success) {
		return {
			status: "error",
			message: "입력값을 확인해 주세요.",
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	try {
		await db`
			INSERT INTO parent_resources (title, description, category, resource_type, file_url, published_at)
			VALUES (${parsed.data.title}, ${parsed.data.description ?? null}, ${parsed.data.category ?? null}, ${parsed.data.resourceType}, ${parsed.data.fileUrl}, ${parsed.data.publishedAt?.toISOString() ?? null})
		`;

		revalidatePath("/admin/parent-resources");
		revalidatePath("/parents/resources");

		return { status: "success", message: "자료가 등록되었습니다." };
	} catch (error) {
		console.error("[createParentResourceAction]", error);
		return { status: "error", message: "자료 등록 중 오류가 발생했습니다." };
	}
}

export async function deleteParentResourceAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return { status: "error", message: "관리자 권한이 필요합니다." };
	}

	const resourceId = formData.get("resourceId")?.toString();
	if (!resourceId) {
		return { status: "error", message: "삭제할 자료를 찾을 수 없습니다." };
	}

	try {
		await db`DELETE FROM parent_resources WHERE id = ${resourceId}`;
		revalidatePath("/admin/parent-resources");
		revalidatePath("/parents/resources");

		return { status: "success", message: "자료가 삭제되었습니다." };
	} catch (error) {
		console.error("[deleteParentResourceAction]", error);
		return { status: "error", message: "삭제 중 문제가 발생했습니다." };
	}
}

export { initialFormState };

export async function updateParentResourceAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return { status: "error", message: "관리자 권한이 필요합니다." };
	}

	const resourceId = formData.get("resourceId")?.toString();
	if (!resourceId) {
		return { status: "error", message: "수정할 자료를 찾을 수 없습니다." };
	}

	const parsed = resourceSchema.safeParse({
		title: formData.get("title")?.toString(),
		description: formData.get("description")?.toString(),
		category: formData.get("category")?.toString(),
		resourceType: formData.get("resourceType")?.toString(),
		fileUrl: formData.get("fileUrl")?.toString(),
		publishedAt: formData.get("publishedAt")?.toString(),
	});

	if (!parsed.success) {
		return {
			status: "error",
			message: "입력값을 확인해 주세요.",
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	try {
		await db`
			UPDATE parent_resources
			SET
				title = ${parsed.data.title},
				description = ${parsed.data.description ?? null},
				category = ${parsed.data.category ?? null},
				resource_type = ${parsed.data.resourceType},
				file_url = ${parsed.data.fileUrl},
				published_at = ${parsed.data.publishedAt?.toISOString() ?? null},
				updated_at = now()
			WHERE id = ${resourceId}
		`;

		revalidatePath("/admin/parent-resources");
		revalidatePath("/parents/resources");

		return { status: "success", message: "자료가 수정되었습니다." };
	} catch (error) {
		console.error("[updateParentResourceAction]", error);
		return { status: "error", message: "자료 수정 중 문제가 발생했습니다." };
	}
}
