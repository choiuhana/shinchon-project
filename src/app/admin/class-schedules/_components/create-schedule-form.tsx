"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Classroom } from "@/lib/data/class-posts-repository";

import { createScheduleAction, initialFormState, type FormState } from "../actions";

export function CreateScheduleForm({ classrooms }: { classrooms: Classroom[] }) {
	const [formState, formAction, pending] = useActionState<FormState, FormData>(
		createScheduleAction,
		initialFormState,
	);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (formState.status === "success") {
			formRef.current?.reset();
		}
	}, [formState.status]);

	return (
		<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold text-[var(--brand-navy)]">일정 등록</h2>
				<p className="text-sm text-muted-foreground">월간 행사, 방문 수업, 운영위원회 등 일정을 등록하세요.</p>
			</div>
			<form ref={formRef} action={formAction} className="mt-6 grid gap-4 md:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="classroomId">대상 반 (선택)</Label>
					<select
						id="classroomId"
						name="classroomId"
						className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
					>
						<option value="">전체</option>
						{classrooms.map((classroom) => (
							<option key={classroom.id} value={classroom.id}>
								{classroom.name}
							</option>
						))}
					</select>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="title">제목</Label>
					<Input id="title" name="title" placeholder="예) 11월 운영위원회" required />
				</div>

				<div className="grid gap-2">
					<Label htmlFor="description">설명</Label>
					<Input id="description" name="description" placeholder="간단한 설명" />
				</div>

				<div className="grid gap-2">
					<Label htmlFor="location">장소</Label>
					<Input id="location" name="location" placeholder="예) 본관 2층 회의실" />
				</div>

				<div className="grid gap-2">
					<Label htmlFor="startDate">시작일시</Label>
					<input
						id="startDate"
						name="startDate"
						type="datetime-local"
						required
						className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="endDate">종료일시 (선택)</Label>
					<input
						id="endDate"
						name="endDate"
						type="datetime-local"
						className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
					/>
				</div>

				<div className="md:col-span-2 flex flex-col gap-3">
					{formState.status === "error" ? (
						<div className="rounded-[var(--radius-sm)] border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
							<p className="font-semibold">{formState.message ?? "저장에 실패했습니다."}</p>
							{formState.issues ? (
								<ul className="mt-2 list-disc space-y-1 pl-4">
									{formState.issues.map((issue) => (
										<li key={issue}>{issue}</li>
									))}
								</ul>
							) : null}
						</div>
					) : null}

					{formState.status === "success" ? (
						<div className="rounded-[var(--radius-sm)] border border-emerald-300/80 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
							{formState.message ?? "등록되었습니다."}
						</div>
					) : null}

					<div className="flex flex-wrap items-center gap-3">
						<Button type="submit" disabled={pending}>
							{pending ? "등록 중..." : "등록"}
						</Button>
						<span className="text-xs text-muted-foreground">등록 후 학부모 포털 일정이 갱신됩니다.</span>
					</div>
				</div>
			</form>
		</section>
	);
}
