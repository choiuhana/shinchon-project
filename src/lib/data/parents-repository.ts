import { cache } from "react";

import { db } from "@/lib/db";

export type ChildOverview = {
	id: string;
	name: string;
	status: string;
	classroomId: string | null;
	classroomName?: string | null;
	leadTeacher?: string | null;
	assistantTeacher?: string | null;
};

export type ClassPostSummary = {
	id: string;
	classroomId: string | null;
	classroomName?: string | null;
	title: string;
	summary?: string | null;
	content: string[];
	publishAt: Date | null;
	attachments: { id: string; label?: string | null; fileUrl: string }[];
};

function parseContent(value: unknown): string[] {
	if (!value) return [];
	if (Array.isArray(value)) {
		return value.map((item) => String(item));
	}
	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) {
				return parsed.map((item) => String(item));
			}
			return [String(parsed)];
		} catch {
			return [value];
		}
	}
	return [];
}

function parseAttachments(value: unknown) {
	if (!value) return [];
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
				})).filter((attachment) => attachment.fileUrl.length > 0);
			}
			return [];
		} catch {
			return [];
		}
	}
	if (Array.isArray(value)) {
		return value
			.map((item) => ({
				id: String((item as { id?: string }).id ?? crypto.randomUUID()),
				label: "label" in (item as Record<string, unknown>)
					? ((item as { label?: string | null }).label ?? null)
					: null,
				fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ""),
			}))
			.filter((attachment) => attachment.fileUrl.length > 0);
	}
	return [];
}

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

async function fetchClassPosts(classroomIds: string[], limit = 6): Promise<ClassPostSummary[]> {
	if (!classroomIds.length) return [];

	const { rows } = await db`
		SELECT
			cp.id,
			cp.classroom_id AS "classroomId",
			title,
			summary,
			content,
			publish_at AS "publishAt",
			cl.name AS "classroomName",
			COALESCE(
				json_agg(
					json_build_object(
						'id', cpa.id,
						'label', cpa.label,
						'fileUrl', cpa.file_url
					)
				) FILTER (WHERE cpa.id IS NOT NULL),
				'[]'
			) AS attachments
		FROM class_posts cp
		LEFT JOIN class_post_attachments cpa ON cpa.post_id = cp.id
		LEFT JOIN classrooms cl ON cl.id = cp.classroom_id
		WHERE cp.classroom_id = ANY(${classroomIds})
		GROUP BY cp.id, cl.name
		ORDER BY COALESCE(cp.publish_at, cp.created_at) DESC
		LIMIT ${limit}
	`;

	return rows.map((row) => ({
		id: String(row.id),
		classroomId: row.classroomId ? String(row.classroomId) : null,
		classroomName: (row.classroomName as string | null) ?? null,
		title: String(row.title),
		summary: (row.summary as string | null) ?? null,
		content: parseContent(row.content),
		publishAt: row.publishAt ? new Date(String(row.publishAt)) : null,
		attachments: parseAttachments(row.attachments),
	}));
}

export const getParentDashboardData = cache(async (parentId: string) => {
	const children = await fetchChildrenForParent(parentId);
	const classroomIds = children
		.map((child) => child.classroomId)
		.filter((id): id is string => Boolean(id));

	const posts = await fetchClassPosts(classroomIds);

	return {
		children,
		posts,
	};
});
