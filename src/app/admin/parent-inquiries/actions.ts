"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { initialFormState, type FormState } from "../form-state";

const inquiryUpdateSchema = z.object({
	inquiryId: z.string().uuid(),
	status: z.enum(["received", "in_review", "completed"]),
	adminReply: z
		.string()
		.optional()
		.transform((value) => {
			const trimmed = value?.trim();
			return trimmed && trimmed.length > 0 ? trimmed : undefined;
		}),
});

export async function updateParentInquiryAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return { status: "error", message: "관리자 권한이 필요합니다." };
	}

	const parsed = inquiryUpdateSchema.safeParse({
		inquiryId: formData.get("inquiryId")?.toString(),
		status: formData.get("status")?.toString(),
		adminReply: formData.get("adminReply")?.toString(),
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
			UPDATE parent_inquiries
			SET status = ${parsed.data.status},
				admin_reply = ${parsed.data.adminReply ?? null},
				replied_at = ${parsed.data.adminReply ? new Date().toISOString() : null},
				updated_at = now()
			WHERE id = ${parsed.data.inquiryId}
		`;

		revalidatePath("/admin/parent-inquiries");
		revalidatePath("/parents/inquiries");

		return { status: "success", message: "문의 상태가 업데이트되었습니다." };
	} catch (error) {
		console.error("[updateParentInquiryAction]", error);
		return { status: "error", message: "업데이트 중 문제가 발생했습니다." };
	}
}

export { initialFormState };
