import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllParentResources } from "@/lib/data/admin-parent-support";

import { CreateParentResourceForm } from "./_components/create-parent-resource-form";
import { DeleteParentResourceButton } from "./_components/delete-parent-resource-button";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
	if (!value) return "게시일 미정";
	return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(value);
}

function resourceTypeLabel(type: string) {
	return type === "committee" ? "운영위원회" : "서식";
}

export default async function AdminParentResourcesPage() {
	const resources = await getAllParentResources();

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
						<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">서식 · 운영위원회 자료</h1>
						<p className="text-sm text-muted-foreground">학부모 포털에 노출되는 행정 서류와 운영위원회 문서를 관리합니다.</p>
					</div>
					<Button variant="outline" asChild>
						<Link href="/admin">대시보드로 돌아가기</Link>
					</Button>
				</div>
				<CreateParentResourceForm />
			</div>

			<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
				<div className="flex items-center justify-between gap-3">
					<div>
						<h2 className="text-lg font-semibold">등록된 자료</h2>
						<p className="text-sm text-muted-foreground">최신 자료가 상단에 표시됩니다. 링크 수정 시 새 항목을 등록해 주세요.</p>
					</div>
					<Badge variant="outline">총 {resources.length}건</Badge>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>유형</TableHead>
							<TableHead>제목</TableHead>
							<TableHead>카테고리</TableHead>
							<TableHead>게시일</TableHead>
							<TableHead>링크</TableHead>
							<TableHead className="text-right">관리</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{resources.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
									등록된 자료가 없습니다.
								</TableCell>
							</TableRow>
						) : (
							resources.map((resource) => (
								<TableRow key={resource.id}>
									<TableCell className="font-medium">{resourceTypeLabel(resource.resourceType)}</TableCell>
									<TableCell>
										<div className="space-y-1">
											<p className="font-semibold">{resource.title}</p>
											{resource.description ? (
												<p className="text-xs text-muted-foreground">{resource.description}</p>
											) : null}
										</div>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{resource.category ?? "-"}</TableCell>
									<TableCell className="text-sm text-muted-foreground">{formatDate(resource.publishedAt)}</TableCell>
									<TableCell className="text-sm">
										<Link
											href={resource.fileUrl}
											target="_blank"
											className="text-[var(--brand-primary)] underline-offset-4 hover:underline"
										>
											열기
										</Link>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button variant="outline" size="sm" asChild>
												<Link href={resource.fileUrl} target="_blank">
													보기
												</Link>
											</Button>
											<Button variant="outline" size="sm" asChild>
												<Link href={`/admin/parent-resources/${resource.id}/edit`}>수정</Link>
											</Button>
											<DeleteParentResourceButton resourceId={resource.id} />
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
					<TableCaption>삭제 시 학부모 포털 자료실에서도 사라집니다.</TableCaption>
				</Table>
			</section>
		</div>
	);
}
