"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { deleteParentResourceAction, initialFormState } from "../actions";

type DeleteParentResourceButtonProps = {
	resourceId: string;
};

export function DeleteParentResourceButton({ resourceId }: DeleteParentResourceButtonProps) {
	const [, formAction, pending] = useActionState(deleteParentResourceAction, initialFormState);

	return (
		<form action={formAction}>
			<input type="hidden" name="resourceId" value={resourceId} />
			<Button type="submit" variant="destructive" size="sm" disabled={pending}>
				삭제
			</Button>
		</form>
	);
}
