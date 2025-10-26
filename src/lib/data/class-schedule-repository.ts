import { cache } from "react";

import { db } from "@/lib/db";

export type ClassSchedule = {
	id: string;
	classroomId: string | null;
	classroomName?: string | null;
	title: string;
	description?: string | null;
	startDate: Date;
	endDate?: Date | null;
	location?: string | null;
};

async function fetchSchedules(options?: {
	classroomId?: string;
	from?: Date;
	to?: Date;
	limit?: number;
}): Promise<ClassSchedule[]> {
	const classroomId = options?.classroomId ?? null;
	const from = options?.from ? options.from.toISOString() : null;
	const to = options?.to ? options.to.toISOString() : null;
	const limit = options?.limit ?? 100;

	const { rows } = await db`
		SELECT
			s.id,
			s.classroom_id AS "classroomId",
			s.title,
			s.description,
			s.start_date AS "startDate",
			s.end_date AS "endDate",
			s.location,
			cl.name AS "classroomName"
		FROM class_schedules s
		LEFT JOIN classrooms cl ON cl.id = s.classroom_id
		WHERE
			(${classroomId}::uuid IS NULL OR s.classroom_id = ${classroomId})
			AND (${from}::timestamp IS NULL OR s.start_date >= ${from})
			AND (${to}::timestamp IS NULL OR s.start_date <= ${to})
		ORDER BY s.start_date ASC
		LIMIT ${limit}
	`;

	return rows.map((row) => ({
		id: String(row.id),
		classroomId: row.classroomId ? String(row.classroomId) : null,
		classroomName: (row.classroomName as string | null) ?? null,
		title: String(row.title),
		description: (row.description as string | null) ?? null,
		startDate: new Date(String(row.startDate)),
		endDate: row.endDate ? new Date(String(row.endDate)) : null,
		location: (row.location as string | null) ?? null,
	}));
}

async function fetchSchedulesForParent(parentId: string, from?: Date, to?: Date): Promise<ClassSchedule[]> {
	const fromValue = from ? from.toISOString() : null;
	const toValue = to ? to.toISOString() : null;

	const { rows } = await db`
		SELECT DISTINCT ON (s.id)
			s.id,
			s.classroom_id AS "classroomId",
			s.title,
			s.description,
			s.start_date AS "startDate",
			s.end_date AS "endDate",
			s.location,
			cl.name AS "classroomName"
		FROM child_parents cp
		JOIN children c ON cp.child_id = c.id
		JOIN class_schedules s ON (s.classroom_id = c.classroom_id OR s.classroom_id IS NULL)
		LEFT JOIN classrooms cl ON cl.id = s.classroom_id
		WHERE cp.parent_id = ${parentId}
			AND (${fromValue}::timestamp IS NULL OR s.start_date >= ${fromValue})
			AND (${toValue}::timestamp IS NULL OR s.start_date <= ${toValue})
		ORDER BY s.id, s.start_date
	`;

	return rows.map((row) => ({
		id: String(row.id),
		classroomId: row.classroomId ? String(row.classroomId) : null,
		classroomName: (row.classroomName as string | null) ?? (row.classroomId ? null : "전체"),
		title: String(row.title),
		description: (row.description as string | null) ?? null,
		startDate: new Date(String(row.startDate)),
		endDate: row.endDate ? new Date(String(row.endDate)) : null,
		location: (row.location as string | null) ?? null,
	}));
}

export const getSchedules = cache(fetchSchedules);
export const getParentSchedules = cache(fetchSchedulesForParent);
