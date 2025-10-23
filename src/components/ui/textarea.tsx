import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex field-sizing-content min-h-32 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white/90 px-[var(--space-sm)] py-[var(--space-sm)] text-base text-[var(--brand-navy)] shadow-[4px_4px_20px_rgba(62,80,103,0.08)] transition-[border,box-shadow,background] duration-200 placeholder:text-muted-foreground focus-visible:border-[var(--brand-secondary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 selection:bg-[var(--brand-secondary)] selection:text-white aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:text-foreground",
				"disabled:cursor-not-allowed disabled:opacity-60",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
