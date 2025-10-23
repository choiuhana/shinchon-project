import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"min-h-11 w-full min-w-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white/85 px-[var(--space-sm)] py-[var(--space-2xs)] text-base text-[var(--brand-navy)] shadow-[4px_4px_20px_rgba(62,80,103,0.06)] transition-[border,box-shadow,background] duration-200 placeholder:text-muted-foreground selection:bg-[var(--brand-secondary)] selection:text-white file:inline-flex file:h-8 file:rounded-[var(--radius-pill)] file:border-0 file:bg-transparent file:px-[var(--space-sm)] file:text-sm file:font-semibold file:uppercase file:tracking-wide file:text-[var(--brand-secondary)] focus-visible:border-[var(--brand-secondary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:text-foreground",
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
