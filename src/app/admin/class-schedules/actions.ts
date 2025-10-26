"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { initialFormState, type FormState } from "../form-state";

const createScheduleSchema = z.object({
	classroomId: z.string().uuid().optional().or(z.literal("")),
	title: z.string().min(2),
	description: z
		.string()
		.optional()
		.transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
	startDate: z.string().min(1),
	endDate: z.string().optional(),
	location: z
		.string()
		.optional()
		.transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
});

function parseScheduleDates(start: string, end?: string) {
	const startDate = new Date(start);
	const endDate = end ? new Date(end) : null;
	if (Number.isNaN(startDate.getTime())) {
		throw new Error("유효한 시작일을 입력해 주세요.");
	}
	if (endDate && Number.isNaN(endDate.getTime())) {
		throw new Error("유효한 종료일을 확인해 주세요.");
	}
	return { startDate, endDate };
}

export async function createScheduleAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return { status: "error", message: "관리자 권한이 필요합니다." };
	}

	const parsed = createScheduleSchema.safeParse({
		classroomId: formData.get("classroomId")?.toString(),
		title: formData.get("title")?.toString() ?? "",
		description: formData.get("description")?.toString(),
		startDate: formData.get("startDate")?.toString() ?? "",
		endDate: formData.get("endDate")?.toString(),
		location: formData.get("location")?.toString(),
	});

	if (!parsed.success) {
		return {
			status: "error",
			message: "입력값을 확인해 주세요.",
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	try {
		const { startDate, endDate } = parseScheduleDates(parsed.data.startDate, parsed.data.endDate);

		await db`
			INSERT INTO class_schedules (classroom_id, title, description, start_date, end_date, location)
			VALUES (${parsed.data.classroomId || null}, ${parsed.data.title}, ${parsed.data.description ?? null}, ${startDate.toISOString()}, ${endDate ? endDate.toISOString() : null}, ${parsed.data.location ?? null})
		`;

		revalidatePath("/admin/class-schedules");
		revalidatePath("/parents");
		revalidatePath("/parents/schedule");

		return { status: "success", message: "일정을 등록했습니다." };
	} catch (error) {
		console.error("[createScheduleAction]", error);
		return { status: "error", message: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다." };
	}
}

export async function deleteScheduleAction(_: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		return { status: "error", message: "관리자 권한이 필요합니다." };
	}

	const scheduleId = formData.get("scheduleId") as string | null;
	if (!scheduleId) {
		return { status: "error", message: "삭제할 일정을 찾지 못했습니다." };
	}

	await db`DELETE FROM class_schedules WHERE id = ${scheduleId}`;
	revalidatePath("/admin/class-schedules");
	revalidatePath("/parents");
	revalidatePath("/parents/schedule");
	return { status: "success", message: "삭제되었습니다." };
}

export { initialFormState };
export type { FormState };
