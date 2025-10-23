import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
	title: "로그인 | 신촌몬테소리유치원",
	description:
		"신촌몬테소리유치원 학부모 및 교직원 로그인. 현재 인증 시스템 구축 중입니다.",
};

export default function MemberLoginPlaceholderPage() {
	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex max-w-sm flex-col gap-8 px-6 py-24 sm:px-10 lg:px-12">
				<div className="flex flex-col gap-3 text-center">
					<Badge variant="outline" className="mx-auto w-fit">
						Member Access
					</Badge>
					<h1 className="font-heading text-[clamp(2rem,4vw,2.75rem)] leading-tight">
						로그인 준비 중입니다
					</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						NextAuth + Vercel Postgres 기반 인증 시스템을 구축하고 있습니다. 베타 기간 동안은 오프라인으로 계정을 발급해 드립니다.
					</p>
				</div>

				<Card>
					<CardHeader className="space-y-1 text-left">
						<CardTitle className="text-lg">임시 로그인 안내</CardTitle>
						<CardDescription>
							2025-01 베타 기간에는 발급된 임시 계정으로 문의 게시판 접근이 가능합니다.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
						<p>정식 로그인 서비스가 열릴 때까지 아래 창은 데모 형태로 유지됩니다.</p>
						<div className="space-y-3">
							<div className="grid gap-1.5">
								<Label htmlFor="email">이메일</Label>
								<Input id="email" placeholder="demo@shinchonkid.com" disabled />
							</div>
							<div className="grid gap-1.5">
								<Label htmlFor="password">비밀번호</Label>
								<Input id="password" type="password" placeholder="********" disabled />
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col gap-3">
						<Button disabled className="w-full">
							로그인 준비 중
						</Button>
						<Button variant="ghost" asChild className="w-full">
							<Link href="mailto:hello@shinchonkid.com?subject=%EC%9E%84%EC%8B%9C%20%EA%B3%84%EC%A0%95%20%EC%9A%94%EC%B2%AD">
								임시 계정 요청하기
							</Link>
						</Button>
						<Button variant="link" asChild className="w-full text-[var(--brand-secondary)]">
							<Link href="/member/register">지금 가입하기</Link>
						</Button>
					</CardFooter>
				</Card>
			</section>
		</div>
	);
}
