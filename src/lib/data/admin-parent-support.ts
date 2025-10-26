import { db } from "@/lib/db";

export type ParentResourceAdmin = {
	id: string;
	title: string;
	description?: string | null;
	category?: string | null;
	resourceType: string;
	fileUrl: string;
	publishedAt: Date | null;
	createdAt: Date;
};

export type ParentInquiryAdmin = {
	id: string;
	parentId: string;
	parentName?: string | null;
	parentEmail: string;
	category: string;
	subject: string;
	message: string;
	status: string;
	adminReply?: string | null;
	repliedAt?: Date | null;
	createdAt: Date;
};

export async function getAllParentResources(): Promise<ParentResourceAdmin[]> {
	const { rows } = await db`
		SELECT
			id,
			title,
			description,
			category,
			resource_type AS "resourceType",
			file_url AS "fileUrl",
			published_at AS "publishedAt",
			created_at AS "createdAt"
		FROM parent_resources
		ORDER BY COALESCE(published_at, created_at) DESC, title ASC
	`;

	return rows.map((row) => ({
		id: String(row.id),
		title: String(row.title),
		description: (row.description as string | null) ?? null,
		category: (row.category as string | null) ?? null,
		resourceType: String(row.resourceType),
		fileUrl: String(row.fileUrl),
		publishedAt: row.publishedAt ? new Date(String(row.publishedAt)) : null,
		createdAt: new Date(String(row.createdAt)),
	}));
}

export async function getParentInquiriesForAdmin(): Promise<ParentInquiryAdmin[]> {
	const { rows } = await db`
		SELECT
			pi.id,
			pi.parent_id AS "parentId",
			pi.category,
			pi.subject,
			pi.message,
			pi.status,
			pi.admin_reply AS "adminReply",
			pi.replied_at AS "repliedAt",
			pi.created_at AS "createdAt",
			u.name AS "parentName",
			u.email AS "parentEmail"
		FROM parent_inquiries pi
		JOIN users u ON u.id = pi.parent_id
		ORDER BY pi.created_at DESC
	`;

	return rows.map((row) => ({
		id: String(row.id),
		parentId: String(row.parentId),
		parentName: (row.parentName as string | null) ?? null,
		parentEmail: String(row.parentEmail),
		category: String(row.category),
		subject: String(row.subject),
		message: String(row.message),
		status: String(row.status),
		adminReply: (row.adminReply as string | null) ?? null,
		repliedAt: row.repliedAt ? new Date(String(row.repliedAt)) : null,
		createdAt: new Date(String(row.createdAt)),
	}));
}
