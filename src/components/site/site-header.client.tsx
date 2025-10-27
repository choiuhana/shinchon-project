"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
	{ href: "/#about", label: "유치원 소개" },
	{ href: "/#programs", label: "교육 프로그램" },
	{ href: "/#admissions", label: "입학 안내" },
	{ href: "/news", label: "알림마당" },
	{ href: "/#visit", label: "오시는 길" },
];

type SiteHeaderClientProps = {
	isAdmin: boolean;
	isAuthenticated: boolean;
};

type CtaButton = {
	key: string;
	label: string;
	href: string;
	variant: "default" | "outline" | "secondary";
	className?: string;
};

export function SiteHeaderClient({ isAdmin, isAuthenticated }: SiteHeaderClientProps) {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileNavOpen]);

	const closeMobileNav = () => setIsMobileNavOpen(false);

	const isAdminRoute = pathname?.startsWith("/admin") ?? false;

	const desktopCtas: CtaButton[] = useMemo(() => {
		const items: CtaButton[] = [
			{ key: "admissions", label: "입학 상담 예약", href: "/#admissions", variant: "default" },
		];

		if (isAdmin) {
			items.push({
				key: "admin-toggle",
				label: isAdminRoute ? "홈 화면" : "관리자 콘솔",
				href: isAdminRoute ? "/" : "/admin",
				variant: "outline",
			});
		} else {
			items.push({
				key: "parents-portal",
				label: "학부모 포털",
				href: "/parents",
				variant: "outline",
				className:
					"border-[var(--brand-secondary)] text-[var(--brand-secondary)] hover:bg-[var(--brand-secondary)]/10",
			});
		}

		return items;
	}, [isAdmin, isAdminRoute]);

	const mobileCtas: CtaButton[] = useMemo(() => {
		const items: CtaButton[] = [
			{ key: "admissions", label: "입학 상담 예약", href: "/#admissions", variant: "default" },
		];

		if (isAdmin) {
			items.push({
				key: "admin-toggle",
				label: isAdminRoute ? "홈 화면" : "관리자 콘솔",
				href: isAdminRoute ? "/" : "/admin",
				variant: "outline",
			});
		} else {
			items.push({
				key: "parents-portal",
				label: "학부모 포털",
				href: "/parents",
				variant: "outline",
				className:
					"border-[var(--brand-secondary)] text-[var(--brand-secondary)] hover:bg-[var(--brand-secondary)]/10",
			});
		}

		items.push({ key: "programs", label: "교육 프로그램 보기", href: "/#programs", variant: "secondary" });

		return items;
	}, [isAdmin, isAdminRoute]);

	const utilityLinks = isAuthenticated ? [] : [{ href: "/member/login", label: "로그인" }];

	return (
		<header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
				<Link href="/" className="flex flex-col">
					<span className="font-heading text-lg font-semibold text-[var(--brand-primary)]">
						신촌몬테소리유치원
					</span>
					<span className="text-xs text-muted-foreground">Shinchon Montessori Kindergarten</span>
				</Link>

				<nav className="hidden items-center gap-6 text-sm font-medium text-[var(--brand-navy)] md:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="transition hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
						>
							{item.label}
						</Link>
					))}
				</nav>

				{utilityLinks.length ? (
					<div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
						{utilityLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="transition hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
							>
								{link.label}
							</Link>
						))}
					</div>
					) : null}

					<div className="hidden items-center gap-2 md:flex">
						{desktopCtas.map((cta) => (
							<Button key={cta.key} variant={cta.variant} size="sm" className={cta.className} asChild>
								<Link href={cta.href}>{cta.label}</Link>
							</Button>
						))}
					</div>

				<button
					type="button"
					className="inline-flex items-center justify-center rounded-full border border-[var(--border)] p-2 text-[var(--brand-navy)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 md:hidden"
					onClick={() => setIsMobileNavOpen(true)}
					aria-label="모바일 메뉴 열기"
				>
					<Menu className="size-5" />
				</button>
			</div>

			{isMobileNavOpen ? (
				<div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm md:hidden">
					<div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
						<span className="font-heading text-lg text-[var(--brand-navy)]">신촌몬테소리유치원</span>
						<button
							type="button"
							className="inline-flex items-center justify-center rounded-full border border-[var(--border)] p-2 text-[var(--brand-navy)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
							onClick={closeMobileNav}
							aria-label="모바일 메뉴 닫기"
						>
							<X className="size-5" />
						</button>
					</div>

					<nav className="flex flex-col gap-6 px-6 py-6 text-base font-medium text-[var(--brand-navy)]">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="rounded-[var(--radius-md)] bg-[var(--brand-mint)]/25 px-4 py-3 transition hover:bg-[var(--brand-mint)]/40"
								onClick={closeMobileNav}
							>
								{item.label}
							</Link>
						))}

						{utilityLinks.length ? (
							<div className="mt-2 border-t border-[var(--border)] pt-6 text-sm text-muted-foreground">
								<p className="mb-3 font-semibold text-[var(--brand-navy)]">빠른 연결</p>
								<div className="flex flex-col gap-3">
									{utilityLinks.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className="rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-3 transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
											onClick={closeMobileNav}
										>
											{link.label}
										</Link>
									))}
								</div>
							</div>
						) : null}
					</nav>

						<div className="flex flex-col gap-3 border-t border-[var(--border)] px-6 py-6">
							{mobileCtas.map((cta) => (
								<Button
									key={cta.key}
									size="lg"
									variant={cta.variant}
									className={cta.className}
									asChild
									onClick={closeMobileNav}
								>
								<Link href={cta.href}>
									{cta.label}
									{cta.key === "admissions" ? <ArrowRight className="ml-2 size-4" /> : null}
								</Link>
							</Button>
						))}
					</div>
				</div>
			) : null}
		</header>
	);
}
