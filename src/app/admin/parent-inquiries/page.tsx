import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getParentInquiriesForAdmin } from "@/lib/data/admin-parent-support";

import { UpdateInquiryForm } from "./_components/update-inquiry-form";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function statusBadge(status: string) {
	switch (status) {
		case "completed":
			return { label: "답변 완료", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" };
		case "in_review":
			return { label: "검토 중", classes: "bg-sky-100 text-sky-700 border-sky-200" };
		default:
			return { label: "접수됨", classes: "bg-amber-100 text-amber-700 border-amber-200" };
	}
}

export default async function AdminParentInquiriesPage() {
	const inquiries = await getParentInquiriesForAdmin();

	const summary = inquiries.reduce(
		(acc, inquiry) => {
			acc.total += 1;
			acc[inquiry.status as "received" | "in_review" | "completed"] =
				(acc[inquiry.status as "received" | "in_review" | "completed"] ?? 0) + 1;
			return acc;
		},
		{ total: 0, received: 0, in_review: 0, completed: 0 },
	);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-12">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
							<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">1:1 문의 관리</h1>
							<p className="text-sm text-muted-foreground">학부모 문의 현황을 확인하고 상태/답변을 실시간으로 업데이트합니다.</p>
						</div>
						<Button variant="outline" asChild>
							<Link href="/admin">← 관리자 홈으로</Link>
						</Button>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ label: "전체", value: summary.total },
							{ label: "접수됨", value: summary.received },
							{ label: "검토 중", value: summary.in_review },
							{ label: "답변 완료", value: summary.completed },
						].map((item) => (
							<Card key={item.label} className="border-[var(--border)] bg-white/90">
								<CardHeader className="space-y-1">
									<CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
										{item.label}
									</CardDescription>
									<CardTitle className="text-2xl">{item.value}</CardTitle>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>

				<section className="space-y-4">
					{inquiries.length === 0 ? (
						<p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-4 py-10 text-center text-sm text-muted-foreground">
							접수된 문의가 없습니다.
						</p>
					) : (
						<div className="space-y-4">
							{inquiries.map((inquiry) => {
								const badge = statusBadge(inquiry.status);
								return (
									<Card key={inquiry.id} className="border-[var(--border)] bg-white/95 shadow-[var(--shadow-soft)]">
										<CardHeader className="space-y-2">
											<div className="flex flex-wrap items-center justify-between gap-3">
												<div>
													<p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
														{inquiry.category} · {formatDate(inquiry.createdAt)}
													</p>
													<CardTitle className="text-lg">{inquiry.subject}</CardTitle>
													<p className="text-sm text-muted-foreground">
														{inquiry.parentName ? `${inquiry.parentName} 가족` : inquiry.parentEmail} · {inquiry.parentEmail}
													</p>
												</div>
												<span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${badge.classes}`}>
													{badge.label}
												</span>
											</div>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-4 py-3 text-sm text-muted-foreground">
												<p className="font-semibold text-[var(--brand-navy)]">문의 내용</p>
												<p className="mt-2 whitespace-pre-line">{inquiry.message}</p>
											</div>
											<UpdateInquiryForm
												inquiryId={inquiry.id}
												initialStatus={inquiry.status}
												initialReply={inquiry.adminReply}
											/>
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}
				</section>
			</section>
		</div>
	);
}
