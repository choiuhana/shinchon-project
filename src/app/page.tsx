import { ArrowRight, CalendarRange, Palette, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const highlights = [
	{ label: "연령 맞춤 커리큘럼", value: "3-7세 4개 트랙" },
	{ label: "주간 프로젝트", value: "18개 활동 시퀀스" },
	{ label: "학부모 만족도", value: "97%" },
];

const featureCards = [
	{
		icon: Sparkles,
		title: "Petit Montessori Flow",
		description:
			"감각/언어/문화/실생활 영역을 하루 루틴에 자연스럽게 배치해 아이가 놀이 속에서 성장하도록 돕습니다.",
	},
	{
		icon: Palette,
		title: "Atelier Creative Lab",
		description:
			"코랄과 라벤더 팔레트가 살아있는 미술·음악 수업으로 감성과 표현력을 동시에 키워요.",
	},
	{
		icon: CalendarRange,
		title: "Family & School Loop",
		description:
			"학부모 앱과 연동된 알림장, 월간 포트폴리오, 상담 예약으로 가정과 교실의 리듬을 연결합니다.",
	},
];

export default function Home() {
	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="relative isolate overflow-hidden">
				<div
					className="pointer-events-none absolute inset-0"
					style={{
						background: "var(--gradient-cloudwalk)",
					}}
				/>
				<div className="relative mx-auto flex max-w-6xl flex-col gap-[var(--space-lg)] px-6 py-[var(--space-4xl)] sm:px-10 lg:px-12">
					<div className="flex flex-col gap-[var(--space-sm)] sm:max-w-2xl">
						<Badge variant="sunshine" className="w-fit uppercase tracking-[0.18em]">
							Petit Theme Revamp
						</Badge>
						<h1 className="font-heading text-[clamp(3.5rem,6vw,4.5rem)] leading-[1.1] text-[var(--brand-navy)]">
							아이의 하루에 코랄 빛을 더하는 신촌몬테소리
						</h1>
						<p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
							놀이와 프로젝트가 조화롭게 이어지는 Petit 감성 커리큘럼으로
							아이의 호기심과 성장을 함께 디자인합니다.
						</p>
					</div>
					<div className="flex flex-col gap-[var(--space-sm)] sm:flex-row sm:items-center sm:gap-[var(--space-md)]">
						<div className="flex flex-wrap gap-[var(--space-2xs)] sm:gap-[var(--space-sm)]">
							<Button variant="default" size="lg">
								입학 상담 예약하기
								<ArrowRight className="size-4" />
							</Button>
							<Button variant="secondary" size="lg">
								교육 프로그램 살펴보기
							</Button>
						</div>
						<p className="text-sm text-muted-foreground">
							상담 신청 후 24시간 이내 담당 교사가 연락드립니다.
						</p>
					</div>
					<div className="grid gap-[var(--space-sm)] sm:grid-cols-3 sm:gap-[var(--space-md)]">
						{highlights.map((item) => (
							<div
								key={item.label}
								className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/85 px-[var(--space-md)] py-[var(--space-sm)] shadow-[var(--shadow-soft)] backdrop-blur-sm"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
									{item.label}
								</p>
								<p className="mt-2 font-heading text-2xl text-[var(--brand-primary)]">
									{item.value}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-6xl flex-col gap-[var(--space-xl)] px-6 py-[var(--space-3xl)] sm:px-10 lg:px-12">
				<header className="flex flex-col gap-[var(--space-sm)] sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-2xl space-y-[var(--space-2xs)]">
						<h2 className="font-heading text-[clamp(2.5rem,4.5vw,3.5rem)] leading-[1.15]">
							Petit Design System으로 다시 짠 브랜드 경험
						</h2>
						<p className="text-base leading-relaxed text-muted-foreground">
							코랄·라벤더 팔레트와 핸드라이팅 악센트를 재현해, 앱과 웹 어디에서나
							일관된 감성과 상호작용을 제공합니다.
						</p>
					</div>
					<Button variant="ghost" size="lg" className="w-full sm:w-auto">
						디자인 가이드 열람하기
						<ArrowRight className="size-4" />
					</Button>
				</header>

				<div className="grid gap-[var(--space-md)] md:grid-cols-3">
					{featureCards.map((feature) => (
						<Card key={feature.title} className="h-full">
							<CardHeader className="space-y-[var(--space-2xs)]">
								<div className="inline-flex size-11 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--brand-secondary)]/12 text-[var(--brand-secondary)] shadow-[var(--shadow-soft)]">
									<feature.icon className="size-5" />
								</div>
								<CardTitle className="font-heading text-xl text-[var(--brand-navy)]">
									{feature.title}
								</CardTitle>
								<CardDescription className="text-sm text-muted-foreground">
									{feature.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="link" className="px-0 text-[var(--brand-secondary)]">
									세부가이드 보기
									<ArrowRight className="size-4" />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
