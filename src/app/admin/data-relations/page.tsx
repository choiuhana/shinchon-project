import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AdminDataRelationsPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
					<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">자녀 · 반 관리 (준비 중)</h1>
					<p className="text-sm text-muted-foreground">
						`children`, `classrooms`, `child_parents` 데이터 구조를 시각화하고 일괄 편집하는 도구를 설계하고 있습니다.
						승인된 학부모와 자녀, 반 배정 현황을 한눈에 확인할 수 있도록 제공될 예정입니다.
					</p>
				</div>
				<Button variant="outline" asChild>
					<Link href="/admin">대시보드로 돌아가기</Link>
				</Button>
			</div>

			<div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow-soft)]">
				<p className="text-sm leading-relaxed text-muted-foreground">
					예정 기능:
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
					<li>학급별 정원/배정 현황, 대기자 리스트</li>
					<li>자녀-부모 관계 관리, 형제자매 묶음, 비상 연락처 업데이트</li>
					<li>DRI: 반 이동/졸업 처리 자동화</li>
				</ul>
				<Badge variant="outline" className="mt-4">
					구현 계획 수립 중
				</Badge>
			</div>
		</div>
	);
}
