"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Classroom } from "@/lib/data/class-posts-repository";

import { createClassPostAction, initialFormState, type FormState } from "../actions";
import { RichTextEditor } from "../../_components/rich-text-editor";

const MAX_ATTACHMENTS = 3;

type CreateClassPostFormProps = {
	classrooms: Classroom[];
};

export function CreateClassPostForm({ classrooms }: CreateClassPostFormProps) {
	const [formState, formAction, pending] = useActionState<FormState, FormData>(
		createClassPostAction,
		initialFormState,
	);
	const formRef = useRef<HTMLFormElement>(null);
	const [editorResetKey, setEditorResetKey] = useState(0);

	useEffect(() => {
		if (formState.status === "success") {
			formRef.current?.reset();
			startTransition(() => {
				setEditorResetKey((key) => key + 1);
			});
		}
	}, [formState.status]);

	return (
		<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold text-[var(--brand-navy)]">반 소식 작성</h2>
				<p className="text-sm text-muted-foreground">반을 선택하고 최근 활동/공지를 공유해 주세요.</p>
			</div>

			<form ref={formRef} action={formAction} className="mt-6 grid gap-6 md:grid-cols-2">
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="classroomId">반 선택</Label>
						<select
							id="classroomId"
							name="classroomId"
							required
							className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
						>
							<option value="">반을 선택하세요</option>
							{classrooms.map((classroom) => (
								<option key={classroom.id} value={classroom.id}>
									{classroom.name}
								</option>
							))}
						</select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="title">제목</Label>
						<Input id="title" name="title" placeholder="예) 10월 주간 프로젝트 안내" required />
					</div>

					<div className="grid gap-2">
						<Label htmlFor="summary">요약 (선택)</Label>
						<Input id="summary" name="summary" placeholder="보호자에게 보여줄 한 줄 요약" />
					</div>

					<div className="grid gap-2">
						<Label htmlFor="publishAt">게시 예정일 (선택)</Label>
						<input
							id="publishAt"
							name="publishAt"
							type="datetime-local"
							className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
						/>
					</div>
				</div>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="contentMarkdown">본문</Label>
						<RichTextEditor name="contentMarkdown" resetKey={editorResetKey} />
						<p className="text-xs text-muted-foreground">아이 활동 사진, 일정 안내 등 상세 내용을 입력해 주세요.</p>
					</div>

					<div className="grid gap-2">
						<span className="text-sm font-medium text-[var(--brand-navy)]">첨부 자료 (최대 {MAX_ATTACHMENTS}개)</span>
						<div className="grid gap-3">
							{Array.from({ length: MAX_ATTACHMENTS }).map((_, index) => (
								<div key={index} className="grid gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(248,247,255,0.6)] p-3">
									<div className="grid gap-1">
										<Label htmlFor={`attachmentLabel-${index}`} className="text-xs">
											첨부 {index + 1} 제목
										</Label>
										<Input id={`attachmentLabel-${index}`} name="attachmentLabel" placeholder="예) 안내문 PDF" />
									</div>
									<div className="grid gap-1">
										<Label htmlFor={`attachmentUrl-${index}`} className="text-xs">
											첨부 {index + 1} URL
										</Label>
										<Input id={`attachmentUrl-${index}`} name="attachmentUrl" placeholder="https://..." />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="md:col-span-2 flex flex-col gap-4">
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
							{formState.message ?? "저장되었습니다."}
						</div>
					) : null}

					<div className="flex flex-wrap items-center gap-3">
						<Button type="submit" disabled={pending}>
							{pending ? "등록 중..." : "등록"}
						</Button>
						<span className="text-xs text-muted-foreground">등록 후 학부모 포털이 즉시 갱신됩니다.</span>
					</div>
				</div>
			</form>
		</section>
	);
}
