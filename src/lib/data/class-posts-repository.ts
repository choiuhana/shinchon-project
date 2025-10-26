import { cache } from "react";

import { db } from "@/lib/db";

export type Classroom = {
	id: string;
	name: string;
	description?: string | null;
	ageRange?: string | null;
	leadTeacher?: string | null;
	assistantTeacher?: string | null;
};

export type ClassPost = {
	id: string;
	classroomId: string | null;
	classroomName?: string | null;
	title: string;
	summary?: string | null;
	content: string[];
	publishAt: Date | null;
	createdAt: Date;
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
				return parsed
					.map((item) => ({
						id: String((item as { id?: string }).id ?? crypto.randomUUID()),
						label: "label" in (item as Record<string, unknown>) ? ((item as { label?: string | null }).label ?? null) : null,
						fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ""),
					}))
					.filter((attachment) => attachment.fileUrl.length > 0);
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
				label: "label" in (item as Record<string, unknown>) ? ((item as { label?: string | null }).label ?? null) : null,
				fileUrl: String((item as { fileUrl?: string }).fileUrl ?? ""),
			}))
			.filter((attachment) => attachment.fileUrl.length > 0);
	}
	return [];
}

function mapRowToClassPost(row: Record<string, unknown>): ClassPost {
	return {
		id: String(row.id),
		classroomId: row.classroomId ? String(row.classroomId) : null,
		classroomName: (row.classroomName as string | null) ?? null,
		title: String(row.title),
		summary: (row.summary as string | null) ?? null,
		content: parseContent(row.content),
		publishAt: row.publishAt ? new Date(String(row.publishAt)) : null,
		createdAt: new Date(String(row.createdAt)),
		attachments: parseAttachments(row.attachments),
	};
}

async function queryClassrooms(): Promise<Classroom[]> {
	const { rows } = await db`
		SELECT id, name, description, age_range AS "ageRange", lead_teacher AS "leadTeacher", assistant_teacher AS "assistantTeacher"
		FROM classrooms
		ORDER BY name
	`;

	return rows.map((row) => ({
		id: String(row.id),
		name: String(row.name),
		description: (row.description as string | null) ?? null,
		ageRange: (row.ageRange as string | null) ?? null,
		leadTeacher: (row.leadTeacher as string | null) ?? null,
		assistantTeacher: (row.assistantTeacher as string | null) ?? null,
	}));
}

async function queryClassPosts(options?: { classroomId?: string; limit?: number }): Promise<ClassPost[]> {
	const classroomId = options?.classroomId ?? null;
	const limit = options?.limit ?? 50;

	const { rows } = await db`
		SELECT
			cp.id,
			cp.classroom_id AS "classroomId",
			cp.title,
			cp.summary,
			cp.content,
			cp.publish_at AS "publishAt",
			cp.created_at AS "createdAt",
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
		WHERE (${classroomId}::uuid IS NULL OR cp.classroom_id = ${classroomId})
		GROUP BY cp.id, cl.name
		ORDER BY COALESCE(cp.publish_at, cp.created_at) DESC
		LIMIT ${limit}
	`;

	return rows.map((row) => mapRowToClassPost(row as Record<string, unknown>));
}

async function queryClassPostById(id: string): Promise<ClassPost | null> {
	const { rows } = await db`
		SELECT
			cp.id,
			cp.classroom_id AS "classroomId",
			cp.title,
			cp.summary,
			cp.content,
			cp.publish_at AS "publishAt",
			cp.created_at AS "createdAt",
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
		WHERE cp.id = ${id}
		GROUP BY cp.id, cl.name
	`;

	if (!rows.length) return null;
	return mapRowToClassPost(rows[0] as Record<string, unknown>);
}

async function queryClassPostsForParent(parentId: string, limit = 20): Promise<ClassPost[]> {
	const { rows } = await db`
		SELECT
			cp.id,
			cp.classroom_id AS "classroomId",
			cp.title,
			cp.summary,
			cp.content,
			cp.publish_at AS "publishAt",
			cp.created_at AS "createdAt",
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
		FROM child_parents cp_map
		JOIN children c ON cp_map.child_id = c.id
		JOIN class_posts cp ON cp.classroom_id = c.classroom_id
		LEFT JOIN class_post_attachments cpa ON cpa.post_id = cp.id
		LEFT JOIN classrooms cl ON cl.id = cp.classroom_id
		WHERE cp_map.parent_id = ${parentId}
		GROUP BY cp.id, cl.name
		ORDER BY COALESCE(cp.publish_at, cp.created_at) DESC
		LIMIT ${limit}
	`;
	return rows.map((row) => mapRowToClassPost(row as Record<string, unknown>));
}

async function queryClassPostForParent(parentId: string, postId: string): Promise<ClassPost | null> {
	const { rows } = await db`
		SELECT
			cp.id,
			cp.classroom_id AS "classroomId",
			cp.title,
			cp.summary,
			cp.content,
			cp.publish_at AS "publishAt",
			cp.created_at AS "createdAt",
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
		FROM child_parents cp_map
		JOIN children c ON cp_map.child_id = c.id
		JOIN class_posts cp ON cp.classroom_id = c.classroom_id
		LEFT JOIN class_post_attachments cpa ON cpa.post_id = cp.id
		LEFT JOIN classrooms cl ON cl.id = cp.classroom_id
		WHERE cp_map.parent_id = ${parentId} AND cp.id = ${postId}
		GROUP BY cp.id, cl.name
	`;

	if (!rows.length) return null;
	return mapRowToClassPost(rows[0] as Record<string, unknown>);
}

export const getClassrooms = cache(queryClassrooms);
export const getClassPosts = cache(queryClassPosts);
export const getClassPost = cache(queryClassPostById);
export const getParentClassPosts = cache(queryClassPostsForParent);
export const getParentClassPost = cache(queryClassPostForParent);
