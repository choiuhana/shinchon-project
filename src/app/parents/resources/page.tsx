import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getParentResourcesOverview } from "@/lib/data/parent-resources-repository";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
	if (!date) return "업데이트 예정";
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

type ParentResourcesPageProps = {
	searchParams?: Promise<{ section?: string }>;
};

export default async function ParentResourcesPage({ searchParams }: ParentResourcesPageProps) {
	const session = await auth();
	if (!session?.user?.id) {
		redirect("/member/login?redirect=/parents/resources");
	}

	const resolvedSearch = (await searchParams) ?? {};
	const focusedSection = resolvedSearch.section === "committee" ? "committee" : "forms";

	const resources = await getParentResourcesOverview();

	const sections = [
		{
			key: "forms",
			title: "서식 자료실",
			description: "출결, 건강, 체험학습 등 가정에서 자주 활용하는 서류를 내려받을 수 있습니다.",
			items: resources.forms,
		},
		{
			key: "committee",
			title: "운영위원회 자료",
			description: "회의록과 예·결산 보고 등 투명한 운영을 위한 자료를 확인하세요.",
			items: resources.committee,
		},
	] as const;

	const orderedSections = focusedSection === "committee" ? [sections[1], sections[0]] : sections;

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:px-10 lg:px-12">
					<Badge variant="outline" className="w-fit">
						Resources
					</Badge>
					<h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] leading-tight">서식 및 운영위원회 자료</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						필요한 문서를 바로 내려받고, 운영위원회에서 논의된 주요 안건을 투명하게 확인하실 수 있습니다.
					</p>
				</div>
			</section>

			<section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
				{orderedSections.map((section) => (
					<div key={section.key} className="space-y-4">
						<div className="space-y-2">
							<h2 className="font-heading text-2xl">{section.title}</h2>
							<p className="text-sm text-muted-foreground">{section.description}</p>
						</div>

						{section.items.length === 0 ? (
							<p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-4 py-8 text-center text-sm text-muted-foreground">
								등록된 자료가 없습니다.
							</p>
						) : (
							<div className="grid gap-4">
								{section.items.map((item) => (
									<Card key={item.id} className="border-[var(--border)] bg-white/90">
										<CardHeader className="space-y-1">
											<CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
												{item.category ?? "공유 자료"} · {formatDate(item.publishedAt)}
											</CardDescription>
											<CardTitle className="text-lg">{item.title}</CardTitle>
										</CardHeader>
										<CardContent className="flex flex-col gap-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
											<p className="flex-1">{item.description ?? "첨부 파일을 열어 자세한 내용을 확인하세요."}</p>
											<Button asChild variant="outline" size="sm" className="w-full whitespace-nowrap lg:w-auto">
												<Link href={item.fileUrl} target="_blank" rel="noopener noreferrer">
													자료 열기
												</Link>
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</div>
				))}

				<Button variant="ghost" size="sm" asChild className="w-fit">
					<Link href="/parents">대시보드로 돌아가기</Link>
				</Button>
			</section>
		</div>
	);
}
