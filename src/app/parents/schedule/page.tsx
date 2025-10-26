import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getParentSchedules } from "@/lib/data/class-schedule-repository";

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

export default async function ParentSchedulePage() {
	const session = await auth();
	if (!session?.user?.id) {
		redirect("/member/login?redirect=/parents/schedule");
	}

	const now = new Date();
	const nextMonth = new Date(now);
	nextMonth.setMonth(now.getMonth() + 1);

	const schedules = await getParentSchedules(session.user.id, now, nextMonth);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:px-10 lg:px-12">
					<Badge variant="outline" className="w-fit">Schedule</Badge>
					<h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] leading-tight">학사 일정</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">다가오는 한 달간의 반별 행사와 전체 일정을 확인하세요.</p>
				</div>
			</section>

			<section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:px-10 lg:px-12">
				{!schedules.length ? (
					<p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-4 py-10 text-center text-sm text-muted-foreground">
						예정된 일정이 없습니다.
					</p>
				) : (
					<div className="grid gap-4">
						{schedules.map((item) => (
							<Card key={item.id} className="border-[var(--border)] bg-white/90">
								<CardHeader className="space-y-1">
									<CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
										{item.classroomName ?? "전체"}
									</CardDescription>
									<CardTitle className="text-lg">{item.title}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm text-muted-foreground">
									<p>{formatDate(item.startDate)} {item.endDate ? `~ ${formatDate(item.endDate)}` : ""}</p>
									{item.location ? <p>장소: {item.location}</p> : null}
									{item.description ? <p>{item.description}</p> : null}
								</CardContent>
							</Card>
						))}
					</div>
				)}

				<Button variant="ghost" size="sm" asChild className="w-fit">
					<Link href="/parents">대시보드로 돌아가기</Link>
				</Button>
			</section>
		</div>
	);
}
