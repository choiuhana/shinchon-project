import { cache } from "react";

import { db } from "@/lib/db";
import { getParentClassPosts } from "./class-posts-repository";

export type ChildOverview = {
	id: string;
	name: string;
	status: string;
	classroomId: string | null;
	classroomName?: string | null;
	leadTeacher?: string | null;
	assistantTeacher?: string | null;
};

async function fetchChildrenForParent(parentId: string): Promise<ChildOverview[]> {
	const { rows } = await db`
		SELECT
			c.id,
			c.name,
			c.status,
			c.classroom_id AS "classroomId",
			cl.name AS "classroomName",
			cl.lead_teacher AS "leadTeacher",
			cl.assistant_teacher AS "assistantTeacher"
		FROM child_parents cp
		JOIN children c ON cp.child_id = c.id
		LEFT JOIN classrooms cl ON cl.id = c.classroom_id
		WHERE cp.parent_id = ${parentId}
		ORDER BY c.name
	`;

	return rows.map((row) => ({
		id: String(row.id),
		name: String(row.name),
		status: String(row.status),
		classroomId: row.classroomId ? String(row.classroomId) : null,
		classroomName: (row.classroomName as string | null) ?? null,
		leadTeacher: (row.leadTeacher as string | null) ?? null,
		assistantTeacher: (row.assistantTeacher as string | null) ?? null,
	}));
}

export const getParentDashboardData = cache(async (parentId: string) => {
	const children = await fetchChildrenForParent(parentId);
	const posts = await getParentClassPosts(parentId, 6);

	return {
		children,
		posts,
	};
});
