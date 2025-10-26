import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getParentInquiryOverview } from "@/lib/data/parent-inquiries-repository";

import { ParentInquiryForm } from "./inquiry-form";

export const dynamic = "force-dynamic";

const statusCopy: Record<
	string,
	{
		label: string;
		classes: string;
	}
> = {
	received: { label: "접수됨", classes: "bg-amber-100 text-amber-700 border-amber-200" },
	in_review: { label: "검토 중", classes: "bg-sky-100 text-sky-700 border-sky-200" },
	completed: { label: "답변 완료", classes: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export default async function ParentInquiryPage() {
	const session = await auth();
	if (!session?.user?.id) {
		redirect("/member/login?redirect=/parents/inquiries");
	}

	const overview = await getParentInquiryOverview(session.user.id);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:px-10 lg:px-12">
					<Badge variant="outline" className="w-fit">
						Support
					</Badge>
					<h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] leading-tight">1:1 문의</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						학사 운영, 생활, 안전 등 궁금한 점을 편하게 남겨 주세요. 담당 교사 또는 운영팀이 확인 후 연락을 드립니다.
					</p>
				</div>
			</section>

			<section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{ label: "전체 문의", value: overview.summary.total },
						{ label: "접수됨", value: overview.summary.received },
						{ label: "검토 중", value: overview.summary.inReview },
						{ label: "답변 완료", value: overview.summary.completed },
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

				<div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
					<div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-sm">
						<div className="space-y-2 pb-4">
							<h2 className="font-heading text-xl">새로운 문의 남기기</h2>
							<p className="text-sm text-muted-foreground">
								운영 시간 내 최대 24시간 이내에 답변을 드립니다. 긴급 문의가 필요한 경우 유치원 대표번호로 연락 주세요.
							</p>
						</div>
						<ParentInquiryForm />
					</div>

					<div className="space-y-4">
						<h2 className="font-heading text-xl">최근 문의 내역</h2>
						{overview.inquiries.length === 0 ? (
							<p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-4 py-10 text-center text-sm text-muted-foreground">
								등록된 문의가 없습니다.
							</p>
						) : (
							<div className="space-y-4">
								{overview.inquiries.map((inquiry) => {
									const status = statusCopy[inquiry.status] ?? {
										label: inquiry.status,
										classes: "bg-slate-100 text-slate-700 border-slate-200",
									};
									return (
										<Card key={inquiry.id} className="border-[var(--border)] bg-white/90">
											<CardHeader className="space-y-2">
												<div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
													<span>{inquiry.category}</span>
													<span>·</span>
													<span>{formatDate(inquiry.createdAt)}</span>
												</div>
												<CardTitle className="text-lg">{inquiry.subject}</CardTitle>
												<span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium ${status.classes}`}>
													{status.label}
												</span>
											</CardHeader>
											<CardContent className="space-y-3 text-sm text-muted-foreground">
												<p className="whitespace-pre-line">{inquiry.message}</p>
												{inquiry.adminReply ? (
													<div className="rounded-[var(--radius-md)] border border-emerald-100 bg-emerald-50 px-4 py-3">
														<p className="text-xs font-semibold text-emerald-700">운영팀 답변</p>
														<p className="mt-1 text-sm text-emerald-800 whitespace-pre-line">{inquiry.adminReply}</p>
														{inquiry.repliedAt ? (
															<p className="mt-1 text-[0.7rem] text-emerald-700/90">{formatDate(inquiry.repliedAt)}</p>
														) : null}
													</div>
												) : null}
											</CardContent>
										</Card>
									);
								})}
							</div>
						)}
					</div>
				</div>

				<Button variant="ghost" size="sm" asChild className="w-fit">
					<Link href="/parents">대시보드로 돌아가기</Link>
				</Button>
			</section>
		</div>
	);
}
