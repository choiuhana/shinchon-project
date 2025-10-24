import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { sql } from "@vercel/postgres";


type AuthenticatedUser = {
	id: string;
	name: string | null;
	email: string;
	role: string;
	status: string;
};

export const authOptions: NextAuthConfig = {
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/member/login",
	},
	providers: [
		Credentials({
			id: "credentials",
			name: "Email & Password",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const email = credentials?.email?.toString().toLowerCase().trim();
				const password = credentials?.password?.toString() ?? "";

				if (!email || !password) {
					return null;
				}

				const result = await sql<AuthenticatedUser & { password_hash: string }>`
					SELECT id, name, email, role, status, password_hash
					FROM users
					WHERE email = ${email}
					LIMIT 1
				`;

				if (result.rowCount === 0) {
					return null;
				}

				const user = result.rows[0];

				const { verifyPassword } = await import("@/lib/auth/password");

				const isValid = verifyPassword(password, user.password_hash);

				if (!isValid) {
					return null;
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					status: user.status,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = (user as AuthenticatedUser).role;
				token.status = (user as AuthenticatedUser).status;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? "";
				session.user.role = typeof token.role === "string" ? token.role : undefined;
				session.user.status = typeof token.status === "string" ? token.status : undefined;
			}
			return session;
		},
	},
};

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			role?: string;
			status?: string;
		};
	}

	interface User {
		role?: string;
		status?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: string;
		status?: string;
	}
}
