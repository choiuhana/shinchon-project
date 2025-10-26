"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { initialFormState } from "../../form-state";
import { updateParentInquiryAction } from "../actions";

const statusOptions = [
	{ value: "received", label: "접수됨" },
	{ value: "in_review", label: "검토 중" },
	{ value: "completed", label: "답변 완료" },
];

type UpdateInquiryFormProps = {
	inquiryId: string;
	initialStatus: string;
	initialReply?: string | null;
};

export function UpdateInquiryForm({ inquiryId, initialStatus, initialReply }: UpdateInquiryFormProps) {
	const [formState, formAction, pending] = useActionState(updateParentInquiryAction, initialFormState);

	return (
		<form action={formAction} className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 p-4">
			<input type="hidden" name="inquiryId" value={inquiryId} />
			<div className="grid gap-2">
				<Label htmlFor={`status-${inquiryId}`}>상태</Label>
				<select
					id={`status-${inquiryId}`}
					name="status"
					defaultValue={initialStatus}
					className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--brand-navy)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
					disabled={pending}
				>
					{statusOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<div className="grid gap-2">
				<Label htmlFor={`adminReply-${inquiryId}`}>운영팀 답변</Label>
				<Textarea
					id={`adminReply-${inquiryId}`}
					name="adminReply"
					rows={3}
					defaultValue={initialReply ?? ""}
					placeholder="답변을 입력하면 학부모 포털에 즉시 노출됩니다."
					disabled={pending}
				/>
			</div>

			{formState.status === "error" ? (
				<p className="text-xs text-red-600">{formState.message ?? "업데이트에 실패했습니다."}</p>
			) : null}
			{formState.status === "success" ? (
				<p className="text-xs text-emerald-600">{formState.message ?? "업데이트되었습니다."}</p>
			) : null}

			<Button type="submit" size="sm" disabled={pending}>
				{pending ? "저장 중..." : "변경 사항 저장"}
			</Button>
		</form>
	);
}
