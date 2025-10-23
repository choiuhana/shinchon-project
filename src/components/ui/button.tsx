import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] px-[var(--space-md)] py-[var(--space-2xs)] text-sm font-semibold tracking-tight transition-[box-shadow,transform,color,background] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 shadow-[var(--shadow-soft)] active:translate-y-[1px]",
	{
		variants: {
			variant: {
				default:
					"bg-[var(--brand-primary)] text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]",
				destructive:
					"bg-destructive text-white hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] focus-visible:ring-destructive/25 dark:focus-visible:ring-destructive/40",
				secondary:
					"bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]",
				outline:
					"border border-[var(--border)] bg-white/70 text-foreground shadow-none hover:border-[var(--brand-primary)] hover:bg-white",
				soft:
					"bg-[var(--muted)] text-foreground shadow-none hover:bg-[rgba(241,239,255,0.85)]",
				ghost:
					"bg-transparent text-foreground shadow-none hover:bg-[rgba(241,239,255,0.6)]",
				gradient:
					"bg-[var(--gradient-sunrise)] text-[var(--brand-navy)] shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-ambient)]",
				link: "shadow-none text-[var(--brand-primary)] underline-offset-4 hover:underline",
			},
			size: {
				default: "min-h-11",
				sm: "min-h-10 gap-1.5 px-[var(--space-sm)] py-[0.375rem] text-sm",
				lg: "min-h-[3.25rem] px-[var(--space-lg)] py-[var(--space-sm)] text-base",
				icon:
					"size-11 rounded-[var(--radius-pill)] px-0 py-0 shadow-[var(--shadow-soft)]",
				"icon-sm":
					"size-9 rounded-[var(--radius-pill)] px-0 py-0 shadow-[var(--shadow-soft)]",
				"icon-lg":
					"size-12 rounded-[var(--radius-pill)] px-0 py-0 shadow-[var(--shadow-elevated)]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
