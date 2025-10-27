"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Bell,
	CalendarDays,
	Database,
	FileText,
	LayoutDashboard,
	MessagesSquare,
	Newspaper,
	Plus,
	Search,
	Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NavItem = {
	label: string;
	href?: string;
	icon: React.ComponentType<{ className?: string }>;
	soon?: boolean;
};

type NavSection = {
	title: string;
	items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
	{
		title: "콘텐츠",
		items: [
			{ label: "대시보드 (공지)", href: "/admin", icon: LayoutDashboard },
			{ label: "반 소식", href: "/admin/class-posts", icon: MessagesSquare },
			{ label: "학사 일정", href: "/admin/class-schedules", icon: CalendarDays },
		],
	},
	{
		title: "커뮤니케이션",
		items: [{ label: "1:1 문의", href: "/admin/parent-inquiries", icon: Newspaper }],
	},
	{
		title: "자료 · 리소스",
		items: [{ label: "서식 · 운영위 자료", href: "/admin/parent-resources", icon: FileText }],
	},
	{
		title: "멤버 & 데이터",
		items: [
			{ label: "회원 관리", href: "/admin/members", icon: Users },
			{ label: "자녀 · 반 관리", href: "/admin/data-relations", icon: Database },
		],
	},
];

const NAV_ITEMS_FLAT = NAV_SECTIONS.flatMap((section) => section.items.filter((item) => item.href));

export function AdminShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="fixed inset-0 flex bg-[var(--background)] text-[var(--brand-navy)]">
			<aside className="hidden h-full w-64 flex-col border-r border-[var(--border)] bg-white/90 px-4 py-6 shadow-[var(--shadow-soft)] md:flex md:overflow-y-auto">
				<div className="px-2 pb-6">
					<p className="font-heading text-lg leading-tight">Shinchon Admin</p>
					<p className="text-xs text-muted-foreground">콘텐츠와 포털 운영을 한곳에서</p>
				</div>
				<nav className="flex-1 space-y-6 pr-1">
					{NAV_SECTIONS.map((section) => (
						<div key={section.title}>
							<p className="px-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
								{section.title}
							</p>
							<ul className="mt-2 space-y-1">
								{section.items.map((item) => (
									<li key={item.label}>
										{item.href ? (
											<Link
												href={item.href}
												className={cn(
													"flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--brand-primary)]/10",
													pathname?.startsWith(item.href)
														? "text-[var(--brand-primary)]"
														: "text-[var(--brand-navy)]/70",
												)}
											>
												<item.icon className="size-4" />
												<span>{item.label}</span>
											</Link>
										) : (
											<div className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-muted-foreground/70">
												<item.icon className="size-4" />
												<span>{item.label}</span>
												<Badge variant="outline" className="ml-auto text-[10px] uppercase">
													Soon
												</Badge>
											</div>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>
			</aside>

			<div className="flex flex-1 min-h-0 flex-col overflow-hidden">
				<header className="border-b border-[var(--border)] bg-white/90 backdrop-blur">
					<div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 lg:px-6">
						<div className="flex items-center gap-3">
							<div className="relative flex-1">
								<Input
									type="search"
									placeholder="콘텐츠, 학부모, 반을 검색하세요"
									className="h-10 rounded-[var(--radius-md)] bg-[var(--background)] pl-4 pr-12 text-sm"
								/>
								<Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
							</div>
							<Button variant="outline" size="sm" className="hidden sm:inline-flex">
								<Plus className="mr-2 size-4" />
								새 글
							</Button>
							<Button variant="ghost" size="icon" className="rounded-full">
								<Bell className="size-4" />
							</Button>
							<Badge variant="outline" className="hidden sm:inline-flex">
								Admin
							</Badge>
						</div>
						<div className="flex gap-2 overflow-x-auto md:hidden">
							{NAV_ITEMS_FLAT.map((item) => (
								<Link
									key={item.href}
									href={item.href!}
									className={cn(
										"inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold",
										pathname?.startsWith(item.href!)
											? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
											: "border-[var(--border)] bg-white/70 text-[var(--brand-navy)]",
									)}
								>
									<item.icon className="size-3.5" />
									{item.label}
								</Link>
							))}
						</div>
					</div>
				</header>

				<main className="flex-1 min-h-0 overflow-y-auto">
					<div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-6">
						<div className="mb-4 flex justify-end">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/">↩ 홈 바로가기</Link>
							</Button>
						</div>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
