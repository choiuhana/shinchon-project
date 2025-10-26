import { cache } from "react";

import { db } from "@/lib/db";

export type ParentInquiry = {
	id: string;
	category: string;
	subject: string;
	message: string;
	status: string;
	adminReply?: string | null;
	repliedAt?: Date | null;
	createdAt: Date;
};

export type ParentInquirySummary = {
	total: number;
	received: number;
	inReview: number;
	completed: number;
};

async function queryParentInquiries(parentId: string): Promise<ParentInquiry[]> {
	const { rows } = await db`
		SELECT
			id,
			category,
			subject,
			message,
			status,
			admin_reply AS "adminReply",
			replied_at AS "repliedAt",
			created_at AS "createdAt"
		FROM parent_inquiries
		WHERE parent_id = ${parentId}
		ORDER BY created_at DESC
	`;

	return rows.map((row) => ({
		id: String(row.id),
		category: String(row.category),
		subject: String(row.subject),
		message: String(row.message),
		status: String(row.status),
		adminReply: (row.adminReply as string | null) ?? null,
		repliedAt: row.repliedAt ? new Date(String(row.repliedAt)) : null,
		createdAt: new Date(String(row.createdAt)),
	}));
}

async function queryParentInquirySummary(parentId: string): Promise<ParentInquirySummary> {
	const { rows } = await db`
		SELECT status, COUNT(*)::int AS count
		FROM parent_inquiries
		WHERE parent_id = ${parentId}
		GROUP BY status
	`;

	const summary: ParentInquirySummary = {
		total: 0,
		received: 0,
		inReview: 0,
		completed: 0,
	};

	for (const row of rows) {
		const status = String(row.status);
		const count = Number(row.count) ?? 0;
		summary.total += count;
		if (status === "received") summary.received += count;
		else if (status === "in_review") summary.inReview += count;
		else if (status === "completed") summary.completed += count;
	}

	return summary;
}

export const getParentInquiries = cache(async (parentId: string) => {
	return queryParentInquiries(parentId);
});

export const getParentInquiryOverview = cache(async (parentId: string) => {
	const [inquiries, summary] = await Promise.all([queryParentInquiries(parentId), queryParentInquirySummary(parentId)]);
	return { inquiries, summary };
});
