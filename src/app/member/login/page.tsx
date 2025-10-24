import type { Metadata } from "next";

import { Suspense } from "react";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
	title: "로그인 | 신촌몬테소리유치원",
	description: "신촌몬테소리유치원 학부모 및 교직원 로그인.",
};

export default function MemberLoginPage() {
	return (
		<Suspense fallback={null}>
			<LoginForm />
		</Suspense>
	);
}
