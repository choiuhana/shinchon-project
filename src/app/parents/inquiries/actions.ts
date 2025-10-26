"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import type { ParentFormState } from "../form-state";

const inquirySchema = z.object({
	category: z.string().optional(),
	subject: z
		.string()
		.trim()
		.min(2, "제목을 입력해 주세요."),
	message: z
		.string()
		.trim()
		.min(10, "문의 내용을 10자 이상 입력해 주세요."),
});

export async function submitParentInquiry(_: ParentFormState, formData: FormData): Promise<ParentFormState> {
	const session = await auth();
	if (!session?.user?.id) {
		return {
			status: "error",
			message: "로그인이 필요합니다.",
		};
	}

	const parsed = inquirySchema.safeParse({
		category: formData.get("category")?.toString(),
		subject: formData.get("subject")?.toString(),
		message: formData.get("message")?.toString(),
	});

	if (!parsed.success) {
		return {
			status: "error",
			message: "입력값을 확인해 주세요.",
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	const category = parsed.data.category && parsed.data.category.length > 0 ? parsed.data.category : "general";

	try {
		await db`
			INSERT INTO parent_inquiries (parent_id, category, subject, message)
			VALUES (${session.user.id}, ${category}, ${parsed.data.subject}, ${parsed.data.message})
		`;

		revalidatePath("/parents/inquiries");

		return {
			status: "success",
			message: "문의가 접수되었습니다.",
		};
	} catch (error) {
		console.error("[submitParentInquiry]", error);
		return {
			status: "error",
			message: "문의 접수 중 오류가 발생했습니다.",
		};
	}
}
