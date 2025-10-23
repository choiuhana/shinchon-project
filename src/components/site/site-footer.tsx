import Link from "next/link";

const contactInfo = [
	{ label: "주소", value: "서울특별시 서대문구 신촌로 43" },
	{ label: "전화", value: "02-324-0671" },
	{ label: "이메일", value: "hello@shinchonkid.com" },
];

const quickLinks = [
	{ href: "#programs", label: "교육 프로그램" },
	{ href: "#admissions", label: "입학 절차" },
	{ href: "#news", label: "공지사항" },
	{ href: "#visit", label: "오시는 길" },
];

export function SiteFooter() {
	return (
		<footer className="border-t border-[var(--border)] bg-[var(--background)]">
			<div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[2fr,1fr] lg:px-12">
				<section className="space-y-4">
					<h2 className="font-heading text-2xl text-[var(--brand-navy)]">신촌몬테소리유치원</h2>
					<p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
						아이 한 명, 한 명의 리듬을 발견하고 키우는 신촌몬테소리유치원은 따뜻한 공동체와
						안전한 배움 환경을 통해 모든 가족이 연결되는 경험을 만들어 갑니다.
					</p>
				</section>

				<section className="grid gap-6 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
					<div>
						<h3 className="font-semibold text-[var(--brand-navy)]">빠른 연결</h3>
						<ul className="mt-3 space-y-2">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="transition hover:text-[var(--brand-primary)]">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-semibold text-[var(--brand-navy)]">연락처</h3>
						<ul className="mt-3 space-y-2">
							{contactInfo.map((item) => (
								<li key={item.label}>
									<span className="font-medium text-[var(--brand-navy)]">{item.label}</span> {item.value}
								</li>
							))}
						</ul>
					</div>
				</section>
			</div>

			<div className="border-t border-[var(--border)] bg-white/80">
				<div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
					<span>© {new Date().getFullYear()} Shinchon Montessori. All rights reserved.</span>
					<div className="flex gap-4">
						<Link href="/privacy" className="hover:text-[var(--brand-primary)]">
							개인정보처리방침
						</Link>
						<Link href="/terms" className="hover:text-[var(--brand-primary)]">
							이용약관
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
