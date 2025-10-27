import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AdminMembersPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
					<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">회원 관리 (준비 중)</h1>
					<p className="text-sm text-muted-foreground">
						`users` 테이블과 연동된 학부모/교직원 계정 관리 도구를 구축할 예정입니다. 승인 상태 변경, 2FA 토글, 역할 부여 등
						기능이 이 화면에 추가됩니다.
					</p>
				</div>
				<Button variant="outline" asChild>
					<Link href="/admin">대시보드로 돌아가기</Link>
				</Button>
			</div>

			<div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow-soft)]">
				<p className="text-sm leading-relaxed text-muted-foreground">
					현재는 관리자 콘솔에서 회원 승인/비활성화를 직접 수행할 수 없습니다. 빠른 시일 내 아래 기능을 제공할 예정입니다.
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
					<li>`users` 테이블 기준 승인/중지/보류 상태 토글</li>
					<li>학부모 vs. 교직원 역할 분리 및 검색</li>
					<li>자녀 연결 상태, 마지막 로그인 기록, 강제 로그아웃</li>
				</ul>
				<Badge variant="outline" className="mt-4">
					곧 제공 예정
				</Badge>
			</div>
		</div>
	);
}
