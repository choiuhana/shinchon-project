"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

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

import { registerAction, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = {
	errors: {},
};

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" className="w-full" disabled={pending}>
			{pending ? "처리 중..." : "회원가입 완료"}
		</Button>
	);
}

export default function RegisterPage() {
	const [state, formAction] = useActionState(registerAction, initialState);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex max-w-md flex-col gap-8 px-6 py-24 sm:px-10 lg:px-12">
				<div className="flex flex-col gap-3 text-center">
					<Badge variant="outline" className="mx-auto w-fit">
						Member Registration
					</Badge>
					<h1 className="font-heading text-[clamp(2rem,4vw,2.75rem)] leading-tight">
						신촌몬테소리 커뮤니티에 가입하기
					</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						회원 가입 후 승인 절차를 거치면 학부모 포털과 공지 알림을 이용할 수 있습니다.
					</p>
				</div>

				<Card>
					<form action={formAction}>
						<CardHeader className="space-y-2 text-left">
							<CardTitle className="text-lg">회원 정보 입력</CardTitle>
							<CardDescription>
								승인 완료 후 학부모 포털 접근이 가능하니 정확한 이메일을 입력해 주세요.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5 text-sm leading-relaxed text-muted-foreground">
							<div className="grid gap-2">
								<Label htmlFor="email">이메일</Label>
								<Input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
								/>
								{state.errors?.email ? (
									<p className="text-xs text-destructive">{state.errors.email}</p>
								) : null}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password">비밀번호</Label>
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									minLength={8}
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="confirmPassword">비밀번호 확인</Label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type="password"
									autoComplete="new-password"
									required
								/>
								{state.errors?.password ? (
									<p className="text-xs text-destructive">{state.errors.password}</p>
								) : null}
							</div>

							<p className="text-xs text-muted-foreground">
								가입 신청이 접수되면 운영자가 승인 후 학부모 포털 접근 안내 메일을 보내드립니다.
							</p>

							{state.genericError ? (
								<p className="text-sm text-destructive">{state.genericError}</p>
							) : null}
						</CardContent>
						<CardFooter className="flex flex-col gap-3">
							<SubmitButton />
							<Button variant="ghost" className="w-full" asChild>
								<Link href="/member/login">이미 계정이 있으신가요? 로그인</Link>
							</Button>
						</CardFooter>
					</form>
				</Card>
			</section>
		</div>
	);
}
