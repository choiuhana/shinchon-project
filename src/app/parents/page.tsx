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
	title: "학부모 포털 준비 중 | 신촌몬테소리유치원",
	description:
		"반 소식, 학사 일정, 서식 다운로드, 1:1 문의 등 학부모 전용 기능이 구축 중입니다.",
};

export default function ParentsPlaceholderPage() {
	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-24 sm:px-10 lg:px-12">
				<header className="space-y-4">
					<Badge variant="outline" className="w-fit">
						Parents Portal
					</Badge>
					<h1 className="font-heading text-[clamp(2.5rem,4vw,3.5rem)] leading-tight">
						학부모 포털이 곧 오픈합니다
					</h1>
					<p className="text-base leading-relaxed text-muted-foreground">
						반별 소식, 학사 일정, 서식 자료실, 1:1 문의 등 보호자 전용 기능을 안정적으로 제공하기 위한 개발을 진행 중입니다.
						오픈 알림 신청을 통해 사용 가능한 시점을 가장 먼저 안내받으세요.
					</p>
				</header>

				<Card>
					<CardHeader>
						<CardTitle>포털에 포함될 주요 기능</CardTitle>
						<CardDescription>
							신촌몬테소리유치원_기능_명세서.md:262-320 기준, 다음 기능이 초기 버전에 포함됩니다.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
						<ul className="list-disc space-y-2 pl-5">
							<li>반별 교육활동 게시판 및 사진·영상 업로드</li>
							<li>연간/월간 학사 일정 및 일정 알림</li>
							<li>서식 자료실 다운로드, 전자 서명 기능</li>
							<li>1:1 문의 및 상담 예약, 운영위원회 자료 공유</li>
							<li>회원 정보, 자녀 정보, 알림 환경 설정</li>
						</ul>
						<p>
							현재는 권한 관리 및 데이터 마이그레이션을 준비 중이며, 로그인 시스템이 연결되는 대로 베타 프로그램을 진행할 예정입니다.
						</p>
					</CardContent>
				</Card>

				<div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-white/85 px-6 py-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2 text-sm text-muted-foreground">
						<p className="font-semibold text-[var(--brand-navy)]">오픈 알림 신청</p>
						<p>
							포털 오픈 시점과 베타 참여 안내를 이메일로 보내드립니다.
						</p>
					</div>
					<Button asChild size="lg">
						<Link href="mailto:hello@shinchonkid.com?subject=%ED%95%99%EB%B6%80%EB%AA%A8%20%ED%8F%AC%ED%84%B8%20%EC%95%8C%EB%A6%BC%20%EC%8B%A0%EC%B2%AD">
							이메일로 알림 신청
						</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
