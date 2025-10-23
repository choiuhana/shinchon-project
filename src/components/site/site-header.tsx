"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
	{ href: "/#about", label: "유치원 소개" },
	{ href: "/#programs", label: "교육 프로그램" },
	{ href: "/#admissions", label: "입학 안내" },
	{ href: "/news", label: "알림마당" },
	{ href: "/#visit", label: "오시는 길" },
];

const utilityLinks = [
	{ href: "/member/login", label: "로그인" },
	{ href: "/parents", label: "학부모 포털" },
];

export function SiteHeader() {
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileNavOpen]);

	const closeMobileNav = () => setIsMobileNavOpen(false);

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

				<div className="hidden md:block">
					<Button variant="default" size="sm" asChild>
						<Link href="/#admissions">입학 상담 예약</Link>
					</Button>
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
					</nav>

					<div className="flex flex-col gap-3 border-t border-[var(--border)] px-6 py-6">
						<Button size="lg" asChild onClick={closeMobileNav}>
							<Link href="/#admissions">
								입학 상담 예약
								<ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
						<Button variant="secondary" size="lg" asChild onClick={closeMobileNav}>
							<Link href="/#programs">교육 프로그램 보기</Link>
						</Button>
					</div>
				</div>
			) : null}
		</header>
	);
}
