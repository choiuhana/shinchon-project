import { cache } from "react";

import { db } from "@/lib/db";

export type ParentResource = {
	id: string;
	title: string;
	description?: string | null;
	category?: string | null;
	resourceType: string;
	fileUrl: string;
	publishedAt: Date | null;
};

async function queryResourcesByType(resourceType: string): Promise<ParentResource[]> {
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
		WHERE resource_type = ${resourceType}
		ORDER BY COALESCE(published_at, created_at) DESC
	`;

	return rows.map((row) => ({
		id: String(row.id),
		title: String(row.title),
		description: (row.description as string | null) ?? null,
		category: (row.category as string | null) ?? null,
		resourceType: String(row.resourceType),
		fileUrl: String(row.fileUrl),
		publishedAt: row.publishedAt ? new Date(String(row.publishedAt)) : row.createdAt ? new Date(String(row.createdAt)) : null,
	}));
}

export const getParentResourcesByType = cache(async (resourceType: "form" | "committee") => {
	return queryResourcesByType(resourceType);
});

export const getParentResourcesOverview = cache(async () => {
	const [forms, committee] = await Promise.all([queryResourcesByType("form"), queryResourcesByType("committee")]);
	return { forms, committee };
});
