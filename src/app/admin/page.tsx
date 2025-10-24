import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
	title: "관리자 콘솔 준비 중 | 신촌몬테소리유치원",
	description:
		"운영 일정, 교사진 공지, 승인 관리 등 관리자 전용 도구가 구축 중입니다. 내부 승인 절차 후 접근이 가능합니다.",
};

export default function AdminDashboardPlaceholderPage() {
	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-24 sm:px-10 lg:px-12">
				<header className="space-y-4">
					<Badge variant="outline" className="w-fit">
						Admin Console
					</Badge>
					<h1 className="font-heading text-[clamp(2.5rem,4vw,3.5rem)] leading-tight">관리자 콘솔</h1>
					<p className="text-base leading-relaxed text-muted-foreground">
						원 운영을 위한 일정 관리, 승인 워크플로우, 자료 공유 기능을 준비 중입니다.
						관리자 전용 기능이 곧 준비됩니다. 시스템 안정화를 거쳐 순차적으로 오픈하겠습니다.
					</p>
				</header>

				<Card>
					<CardHeader>
						<CardTitle>앞으로 제공될 관리자 기능</CardTitle>
						<CardDescription>승인된 교직원만 접근할 수 있으며, 로그가 철저히 기록됩니다.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
						<ul className="list-disc space-y-2 pl-5">
							<li>신규 회원 승인 및 권한 관리</li>
							<li>반별 게시물/자료 업로드 승인 워크플로우</li>
							<li>행사·학사 일정 템플릿 관리</li>
							<li>보안 로그 및 시스템 상태 모니터링</li>
						</ul>
						<p>
							현재는 접근 제어 및 감사 로깅을 검증하고 있으며, 초기 베타에 참여하고 싶으시면 운영팀에 문의해 주세요.
						</p>
					</CardContent>
				</Card>

				<div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-white/85 px-6 py-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2 text-sm text-muted-foreground">
						<p className="font-semibold text-[var(--brand-navy)]">관리자 지원 채널</p>
						<p>권한 요청이나 운영 관련 문의는 아래 채널을 통해 접수해 주세요.</p>
					</div>
					<Button variant="ghost" asChild>
						<Link href="mailto:admin@shinchonkid.com?subject=%EA%B4%80%EB%A6%AC%EC%9E%90%20%ED%86%B5%ED%95%A9%20%EB%AC%B8%EC%9D%98">
							이메일 문의
						</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
