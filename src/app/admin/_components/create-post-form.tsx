"use client";

import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NewsCategory } from "@/lib/data/news";

import { createNewsPostAction, updateNewsPostAction } from "../actions";
import { initialFormState, type FormState } from "../form-state";
import { RichTextEditor } from "./rich-text-editor";

type NewsPostFormValues = {
	postId?: string;
	title?: string;
	category?: string;
	summary?: string | null;
	contentMarkdown?: string;
	publishAt?: string | null;
	heroImageUrl?: string | null;
	heroImageAlt?: string | null;
	isHighlighted?: boolean;
	audienceScope?: string;
	slug?: string | null;
	attachments?: { label?: string | null; url?: string | null }[];
};

type NewsPostFormProps = {
	categories: NewsCategory[];
	mode: "create" | "edit";
	initialValues?: NewsPostFormValues;
};

const MAX_ATTACHMENTS = 3;

function toDateTimeLocal(date?: string | Date | null) {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return "";
	const pad = (num: number) => String(num).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
		d.getMinutes(),
	)}`;
}

function getDefaultAttachments(initial?: { label?: string | null; url?: string | null }[]) {
	const values = initial ?? [];
	return Array.from({ length: MAX_ATTACHMENTS }).map((_, index) => values[index] ?? { label: "", url: "" });
}

function NewsPostForm({ categories, mode, initialValues }: NewsPostFormProps) {
	const serverAction = mode === "create" ? createNewsPostAction : updateNewsPostAction;
	const [formState, formAction, pending] = useActionState<FormState, FormData>(serverAction, initialFormState);
	const formRef = useRef<HTMLFormElement>(null);
	const [editorResetKey, setEditorResetKey] = useState(0);
	const [showAdvanced, setShowAdvanced] = useState(
		Boolean(
			initialValues?.slug ||
				initialValues?.attachments?.some((attachment) => (attachment?.label ?? attachment?.url ?? "") !== ""),
		),
	);

	const attachments = useMemo(() => getDefaultAttachments(initialValues?.attachments), [initialValues?.attachments]);
	const initialContent = initialValues?.contentMarkdown ?? "";

	useEffect(() => {
		if (formState.status === "success" && mode === "create") {
			formRef.current?.reset();
			startTransition(() => {
				setShowAdvanced(false);
				setEditorResetKey((key) => key + 1);
			});
		}
	}, [formState.status, mode]);

	const heading = mode === "create" ? "게시글 작성" : "게시글 수정";
	const description =
		mode === "create"
			? "공지, 가정통신문, 행사 페이지에 노출될 콘텐츠를 등록합니다. 본문은 단락마다 줄바꿈으로 나누어 주세요."
			: "기존 게시글의 내용을 수정합니다. 저장 시 뉴스/홈 캐시가 갱신됩니다.";
	const submitLabel = mode === "create" ? "게시글 등록" : "변경 사항 저장";

	return (
		<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold text-[var(--brand-navy)]">{heading}</h2>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>

			<form
				ref={formRef}
				action={formAction}
				className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
			>
				{mode === "edit" && initialValues?.postId ? <input type="hidden" name="postId" value={initialValues.postId} /> : null}
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="title">제목</Label>
						<Input
							id="title"
							name="title"
							defaultValue={initialValues?.title ?? ""}
							placeholder="예) 2026학년도 입학설명회 안내"
							required
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="category">카테고리</Label>
						<select
							id="category"
							name="category"
							defaultValue={initialValues?.category ?? categories[0]?.key}
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
							defaultValue={initialValues?.summary ?? ""}
							placeholder="요약 문장을 입력하세요."
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="contentMarkdown">본문</Label>
						<RichTextEditor
							name="contentMarkdown"
							initialValue={initialContent}
							resetKey={mode === "create" ? editorResetKey : undefined}
						/>
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
							defaultValue={toDateTimeLocal(initialValues?.publishAt ?? null)}
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
							defaultValue={initialValues?.heroImageUrl ?? ""}
							placeholder="https://..."
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="heroImageAlt">대표 이미지 설명</Label>
						<Input
							id="heroImageAlt"
							name="heroImageAlt"
							defaultValue={initialValues?.heroImageAlt ?? ""}
							placeholder="이미지 대체 텍스트를 입력하세요."
						/>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="checkbox"
							id="isHighlighted"
							name="isHighlighted"
							className="size-4 rounded border border-[var(--border)] accent-[var(--brand-primary)]"
							defaultChecked={initialValues?.isHighlighted ?? false}
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
							defaultValue={initialValues?.audienceScope ?? "public"}
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
									defaultValue={initialValues?.slug ?? ""}
									placeholder="미입력 시 제목을 기반으로 자동 생성"
								/>
							</div>

							<div className="grid gap-2">
								<span className="text-sm font-medium text-[var(--brand-navy)]">첨부 자료 (최대 {MAX_ATTACHMENTS}개)</span>
								<div className="grid gap-3">
									{attachments.map((attachment, index) => (
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
													defaultValue={attachment.label ?? ""}
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
													defaultValue={attachment.url ?? ""}
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
							{pending ? "진행 중..." : submitLabel}
						</Button>
						<span className="text-xs text-muted-foreground">
							{mode === "create"
								? "등록 후 `/news`, `/` 페이지의 캐시가 자동으로 갱신됩니다."
								: "저장 후 `/news`, `/` 페이지의 캐시가 자동으로 갱신됩니다."}
						</span>
					</div>
				</div>
			</form>
		</section>
	);
}

export function CreatePostForm({ categories }: { categories: NewsCategory[] }) {
	return <NewsPostForm categories={categories} mode="create" />;
}

export function EditPostForm({
	categories,
	initialValues,
}: {
	categories: NewsCategory[];
	initialValues: NewsPostFormValues;
}) {
	return <NewsPostForm categories={categories} mode="edit" initialValues={initialValues} />;
}

export type { NewsPostFormValues };
