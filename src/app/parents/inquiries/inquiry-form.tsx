"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { initialParentFormState, type ParentFormState } from "../form-state";
import { submitParentInquiry } from "./actions";

const categoryOptions = [
	{ value: "general", label: "일반 문의" },
	{ value: "document", label: "행정/서류" },
	{ value: "safety", label: "생활·안전" },
	{ value: "support", label: "건의·칭찬" },
];

export function ParentInquiryForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const [formState, formAction, pending] = useActionState<ParentFormState, FormData>(
		submitParentInquiry,
		initialParentFormState,
	);

	useEffect(() => {
		if (formState.status === "success") {
			formRef.current?.reset();
		}
	}, [formState.status]);

	return (
		<form ref={formRef} action={formAction} className="space-y-5">
			<div className="grid gap-2">
				<Label htmlFor="category">문의 유형</Label>
				<select
					id="category"
					name="category"
					className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/90 px-3 py-2 text-sm text-[var(--brand-navy)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
					disabled={pending}
					defaultValue="general"
				>
					{categoryOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="subject">제목</Label>
				<Input id="subject" name="subject" placeholder="예: 11월 견학 관련 문의드립니다." required disabled={pending} />
			</div>

			<div className="grid gap-2">
				<Label htmlFor="message">내용</Label>
				<Textarea
					id="message"
					name="message"
					minLength={10}
					rows={5}
					placeholder="문의 내용을 10자 이상 입력해 주세요."
					disabled={pending}
					required
				/>
			</div>

			{formState.status === "error" ? (
				<div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					<p>{formState.message ?? "문의 접수에 실패했습니다."}</p>
					{formState.issues?.length ? (
						<ul className="mt-2 space-y-1 text-xs">
							{formState.issues.map((issue) => (
								<li key={issue}>• {issue}</li>
							))}
						</ul>
					) : null}
				</div>
			) : null}

			{formState.status === "success" ? (
				<div
					className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
					role="status"
				>
					{formState.message}
				</div>
			) : null}

			<Button type="submit" disabled={pending} className="w-full sm:w-auto">
				{pending ? "전송 중..." : "문의 보내기"}
			</Button>
		</form>
	);
}
