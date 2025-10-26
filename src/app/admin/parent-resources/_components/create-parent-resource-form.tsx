"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createParentResourceAction, initialFormState, updateParentResourceAction } from "../actions";

const typeOptions = [
	{ value: "form", label: "서식 자료" },
	{ value: "committee", label: "운영위원회 자료" },
];

type ParentResourceFormValues = {
	resourceId?: string;
	title?: string;
	category?: string | null;
	resourceType?: string;
	fileUrl?: string;
	description?: string | null;
	publishedAt?: string | null;
};

type ParentResourceFormProps = {
	mode: "create" | "edit";
	initialValues?: ParentResourceFormValues;
};

function ParentResourceForm({ mode, initialValues }: ParentResourceFormProps) {
	const serverAction = mode === "create" ? createParentResourceAction : updateParentResourceAction;
	const formRef = useRef<HTMLFormElement>(null);
	const [formState, formAction, pending] = useActionState(serverAction, initialFormState);

	useEffect(() => {
		if (formState.status === "success" && mode === "create") {
			formRef.current?.reset();
		}
	}, [formState.status, mode]);

	const heading = mode === "create" ? "새 자료 등록" : "자료 수정";
	const submitLabel = mode === "create" ? "자료 등록" : "변경 사항 저장";

	return (
		<form ref={formRef} action={formAction} className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
			<div className="space-y-1">
				<h2 className="font-heading text-xl">{heading}</h2>
				<p className="text-sm text-muted-foreground">학부모 포털의 서식 자료실/운영위원회 영역에 노출됩니다.</p>
			</div>

			{mode === "edit" && initialValues?.resourceId ? (
				<input type="hidden" name="resourceId" value={initialValues.resourceId} />
			) : null}

			<div className="grid gap-4 md:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="title">제목</Label>
					<Input
						id="title"
						name="title"
						defaultValue={initialValues?.title ?? ""}
						placeholder="예: 외출·조퇴 신청서"
						required
						disabled={pending}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="category">카테고리</Label>
					<Input
						id="category"
						name="category"
						defaultValue={initialValues?.category ?? ""}
						placeholder="행정/생활"
						disabled={pending}
					/>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="grid gap-2">
					<Label htmlFor="resourceType">자료 유형</Label>
					<select
						id="resourceType"
						name="resourceType"
						className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--brand-navy)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
						defaultValue={initialValues?.resourceType ?? "form"}
						disabled={pending}
					>
						{typeOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="publishedAt">게시일 (선택)</Label>
					<Input
						id="publishedAt"
						name="publishedAt"
						type="date"
						defaultValue={initialValues?.publishedAt ?? ""}
						disabled={pending}
					/>
				</div>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="fileUrl">파일 URL</Label>
				<Input
					id="fileUrl"
					name="fileUrl"
					type="url"
					defaultValue={initialValues?.fileUrl ?? ""}
					placeholder="https://example.com/doc.pdf"
					required
					disabled={pending}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="description">설명</Label>
				<Textarea
					id="description"
					name="description"
					rows={3}
					defaultValue={initialValues?.description ?? ""}
					placeholder="자료에 대한 간단한 설명을 입력하세요."
					disabled={pending}
				/>
			</div>

			{formState.status === "error" ? (
				<div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					<p>{formState.message ?? "자료 등록에 실패했습니다."}</p>
					{formState.issues?.length ? (
						<ul className="mt-2 list-disc space-y-1 pl-4 text-xs">
							{formState.issues.map((issue) => (
								<li key={issue}>{issue}</li>
							))}
						</ul>
					) : null}
				</div>
			) : null}

			{formState.status === "success" ? (
				<div className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
					{formState.message}
				</div>
			) : null}

			<Button type="submit" disabled={pending}>
				{pending ? "진행 중..." : submitLabel}
			</Button>
		</form>
	);
}

export function CreateParentResourceForm() {
	return <ParentResourceForm mode="create" />;
}

export function EditParentResourceForm({ initialValues }: { initialValues: ParentResourceFormValues }) {
	return <ParentResourceForm mode="edit" initialValues={initialValues} />;
}

export type { ParentResourceFormValues };
