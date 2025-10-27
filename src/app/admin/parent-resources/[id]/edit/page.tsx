import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { EditParentResourceForm, type ParentResourceFormValues } from "../../_components/create-parent-resource-form";

type EditParentResourcePageProps = {
	params: Promise<{ id: string }>;
};

async function getParentResourceById(id: string) {
	const { rows } = await db`
		SELECT
			id AS "resourceId",
			title,
			category,
			description,
			resource_type AS "resourceType",
			file_url AS "fileUrl",
			TO_CHAR(published_at, 'YYYY-MM-DD') AS "publishedAt"
		FROM parent_resources
		WHERE id = ${id}
	`;

	if (!rows.length) {
		return null;
	}

	return rows[0] as ParentResourceFormValues & { resourceId: string };
}

export default async function EditParentResourcePage({ params }: EditParentResourcePageProps) {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		redirect("/member/login?redirect=/admin/parent-resources");
	}

	const { id } = await params;
	const resource = await getParentResourceById(id);

	if (!resource) {
		notFound();
	}

	const initialValues: ParentResourceFormValues = {
		resourceId: resource.resourceId,
		title: resource.title,
		category: resource.category,
		description: resource.description,
		resourceType: resource.resourceType ?? "form",
		fileUrl: resource.fileUrl,
		publishedAt: resource.publishedAt ?? "",
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
					<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">자료 수정</h1>
					<p className="text-sm text-muted-foreground">서식/운영위원회 문서를 편집해 최신 정보를 유지하세요.</p>
				</div>
				<Button variant="outline" asChild>
					<Link href="/admin/parent-resources">목록으로 돌아가기</Link>
				</Button>
			</div>

			<EditParentResourceForm initialValues={initialValues} />
		</div>
	);
}
