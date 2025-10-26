import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClassrooms } from "@/lib/data/class-posts-repository";
import { getSchedules } from "@/lib/data/class-schedule-repository";

import { CreateScheduleForm } from "./_components/create-schedule-form";
import { DeleteScheduleButton } from "./_components/delete-schedule-button";

export const dynamic = "force-dynamic";

function formatDateRange(start: Date, end?: Date | null) {
	const startStr = new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(start);
	if (!end) return startStr;
	const endStr = new Intl.DateTimeFormat("ko-KR", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(end);
	return `${startStr} ~ ${endStr}`;
}

export default async function AdminClassSchedulesPage() {
	const [classrooms, schedules] = await Promise.all([
		getClassrooms(),
		getSchedules({ limit: 200 }),
	]);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-12">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
						<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">학사 일정 관리</h1>
						<p className="text-sm text-muted-foreground">반별 일정과 전체 행사를 등록하고 학부모 포털에 노출합니다.</p>
					</div>
					<Button variant="outline" asChild>
						<Link href="/admin">← 관리자 홈</Link>
					</Button>
				</div>

				<CreateScheduleForm classrooms={classrooms} />

				<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-semibold">등록된 일정</h2>
							<p className="text-sm text-muted-foreground">날짜 순으로 정렬됩니다.</p>
						</div>
						<Badge variant="outline">총 {schedules.length}건</Badge>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>대상</TableHead>
								<TableHead>제목</TableHead>
								<TableHead>기간</TableHead>
								<TableHead>장소</TableHead>
								<TableHead className="text-right">관리</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{schedules.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
										등록된 일정이 없습니다.
									</TableCell>
								</TableRow>
							) : (
								schedules.map((schedule) => (
									<TableRow key={schedule.id}>
										<TableCell>{schedule.classroomName ?? "전체"}</TableCell>
										<TableCell className="font-semibold">{schedule.title}</TableCell>
										<TableCell>{formatDateRange(schedule.startDate, schedule.endDate)}</TableCell>
										<TableCell>{schedule.location ?? "-"}</TableCell>
										<TableCell className="text-right">
											<DeleteScheduleButton scheduleId={schedule.id} />
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
						<TableCaption>삭제 시 학부모 포털 일정에서도 제거됩니다.</TableCaption>
					</Table>
				</section>
			</section>
		</div>
	);
}
