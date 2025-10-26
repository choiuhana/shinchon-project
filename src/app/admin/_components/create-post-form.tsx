"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NewsCategory } from "@/lib/data/news";

import { createNewsPostAction } from "../actions";
import { initialFormState, type FormState } from "../form-state";
import { RichTextEditor } from "./rich-text-editor";

type CreatePostFormProps = {
	categories: NewsCategory[];
};

const MAX_ATTACHMENTS = 3;

export function CreatePostForm({ categories }: CreatePostFormProps) {
	const [formState, formAction, pending] = useActionState<FormState, FormData>(
		createNewsPostAction,
		initialFormState,
	);
	const formRef = useRef<HTMLFormElement>(null);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [editorResetKey, setEditorResetKey] = useState(0);

	useEffect(() => {
		if (formState.status === "success") {
			formRef.current?.reset();
			startTransition(() => {
				setShowAdvanced(false);
				setEditorResetKey((key) => key + 1);
			});
		}
	}, [formState.status]);

	return (
		<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold text-[var(--brand-navy)]">게시글 작성</h2>
				<p className="text-sm text-muted-foreground">
					공지, 가정통신문, 행사 페이지에 노출될 콘텐츠를 등록합니다. 본문은 단락마다 줄바꿈으로
					나누어 주세요.
				</p>
			</div>

			<form
				ref={formRef}
				action={formAction}
				className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
			>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="title">제목</Label>
						<Input id="title" name="title" placeholder="예) 2026학년도 입학설명회 안내" required />
					</div>

					<div className="grid gap-2">
						<Label htmlFor="category">카테고리</Label>
						<select
							id="category"
							name="category"
							defaultValue={categories[0]?.key}
							className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
						>
							{categories.map((category) => (
								<option key={category.key} value={category.key}>
									{category.label}
								</option>
							))}
						</select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="summary">요약 (선택)</Label>
						<Input
							id="summary"
							name="summary"
							placeholder="요약 문장을 입력하세요."
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="contentMarkdown">본문</Label>
						<RichTextEditor name="contentMarkdown" initialValue="" resetKey={editorResetKey} />
						<p className="text-xs text-muted-foreground">
							툴바를 사용해 제목, 굵게, 인용, 리스트 등을 입력할 수 있습니다.
						</p>
					</div>
				</div>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="publishAt">게시 예정일 (선택)</Label>
						<input
							id="publishAt"
							name="publishAt"
							type="datetime-local"
							className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
						/>
						<p className="text-xs text-muted-foreground">
							입력하면 해당 시각 기준으로 정렬됩니다. 미입력 시 생성 시각이 사용됩니다.
						</p>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="heroImageUrl">대표 이미지 URL (선택)</Label>
						<Input
							id="heroImageUrl"
							name="heroImageUrl"
							placeholder="https://..."
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="heroImageAlt">대표 이미지 설명</Label>
						<Input
							id="heroImageAlt"
							name="heroImageAlt"
							placeholder="이미지 대체 텍스트를 입력하세요."
						/>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="isHighlighted"
							name="isHighlighted"
							className="size-4 rounded border border-[var(--border)] accent-[var(--brand-primary)]"
						/>
						<Label htmlFor="isHighlighted" className="text-sm font-medium text-[var(--brand-navy)]">
							홈 미리보기로 노출
						</Label>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="audienceScope">공개 범위</Label>
						<select
							id="audienceScope"
							name="audienceScope"
							defaultValue="public"
							className="h-11 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white px-3 text-sm text-[var(--brand-navy)]"
						>
							<option value="public">전체 공개</option>
							<option value="parents">학부모 전용</option>
						</select>
					</div>

					<button
						type="button"
						onClick={() => setShowAdvanced((prev) => !prev)}
						className="text-sm font-medium text-[var(--brand-primary)] underline-offset-4 hover:underline"
					>
						부가 설정 {showAdvanced ? "숨기기" : "보기"}
					</button>

					{showAdvanced ? (
						<div className="grid gap-4 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-4">
							<div className="grid gap-2">
								<Label htmlFor="slug">슬러그 (선택)</Label>
								<Input
									id="slug"
									name="slug"
									placeholder="미입력 시 제목을 기반으로 자동 생성"
								/>
							</div>

							<div className="grid gap-2">
								<span className="text-sm font-medium text-[var(--brand-navy)]">첨부 자료 (최대 {MAX_ATTACHMENTS}개)</span>
								<div className="grid gap-3">
									{Array.from({ length: MAX_ATTACHMENTS }).map((_, index) => (
										<div
											key={index}
											className="grid gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[rgba(248,247,255,0.6)] p-3"
										>
											<div className="grid gap-1">
												<Label htmlFor={`attachmentLabel-${index}`} className="text-xs">
													첨부 {index + 1} 제목
												</Label>
												<Input
													id={`attachmentLabel-${index}`}
													name="attachmentLabel"
													placeholder="예) 안내문 PDF"
												/>
											</div>
											<div className="grid gap-1">
												<Label htmlFor={`attachmentUrl-${index}`} className="text-xs">
													첨부 {index + 1} URL
												</Label>
												<Input
													id={`attachmentUrl-${index}`}
													name="attachmentUrl"
													placeholder="https://..."
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					) : null}
				</div>

				<div className="md:col-span-2 flex flex-col gap-4">
					{formState.status === "error" && (
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
					)}

					{formState.status === "success" && (
						<div className="rounded-[var(--radius-sm)] border border-emerald-300/80 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
							{formState.message ?? "저장되었습니다."}
						</div>
					)}

					<div className="flex flex-wrap items-center gap-3">
						<Button type="submit" disabled={pending}>
							{pending ? "등록 중..." : "게시글 등록"}
						</Button>
						<span className="text-xs text-muted-foreground">
							등록 후 `/news`, `/` 페이지의 캐시가 자동으로 갱신됩니다.
						</span>
					</div>
				</div>
			</form>
		</section>
	);
}
