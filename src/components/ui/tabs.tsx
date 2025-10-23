"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn("flex flex-col gap-[var(--space-2xs)]", className)}
			{...props}
		/>
	);
}

function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"inline-flex w-fit items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white/70 p-[6px] shadow-[var(--shadow-soft)]",
				className,
			)}
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-xs)] border border-transparent px-[var(--space-sm)] py-[var(--space-3xs)] text-sm font-semibold text-[var(--brand-navy)] transition-[color,background,box-shadow] duration-200 focus-visible:border-[var(--brand-secondary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:shadow-[var(--shadow-soft)] data-[state=active]:text-[var(--brand-primary)] dark:data-[state=active]:bg-input/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
