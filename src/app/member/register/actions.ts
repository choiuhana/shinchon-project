"use server";

import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";

import { hashPassword } from "@/lib/auth/password";

export type RegisterFormState = {
	errors: {
		email?: string;
		password?: string;
	};
	genericError?: string;
};

export async function registerAction(
	prevState: RegisterFormState,
	formData: FormData,
): Promise<RegisterFormState> {
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const password = String(formData.get("password") ?? "");
	const confirmPassword = String(formData.get("confirmPassword") ?? "");
	const role = "parent";
	const status = "pending";

	const errors: RegisterFormState["errors"] = {};

	if (!email) {
		errors.email = "이메일을 입력해 주세요.";
	} else if (!/^[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/.test(email)) {
		errors.email = "유효한 이메일 주소를 입력해 주세요.";
	}

	if (!password) {
		errors.password = "비밀번호를 입력해 주세요.";
	} else if (password.length < 8) {
		errors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
	} else if (password !== confirmPassword) {
		errors.password = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
	}

	if (errors.email || errors.password) {
		return { errors };
	}

	try {
		const existing = await sql`
			SELECT id FROM users WHERE email = ${email}
		`;

		if (existing.rowCount && existing.rows.length > 0) {
			return {
				errors: {
					email: "이미 가입된 이메일입니다.",
				},
			};
		}

		const passwordHash = hashPassword(password);

		await sql`
			INSERT INTO users (email, password_hash, role, status)
			VALUES (${email}, ${passwordHash}, ${role}, ${status})
		`;
	} catch (error) {
		console.error("registerAction error", error);
		const message = "회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
		return {
			errors: {},
			genericError: message,
		};
	}

	redirect("/member/login?registered=1");
	return prevState;
}
