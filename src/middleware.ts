import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
	const { pathname, searchParams, origin } = request.nextUrl;
	const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
	const secureCookie = request.nextUrl.protocol === "https:";
	const cookieName = secureCookie ? "__Secure-authjs.session-token" : "authjs.session-token";
	const salt = process.env.AUTH_SALT ?? process.env.NEXTAUTH_SALT ?? cookieName;

	if (!secret) {
		throw new Error("AUTH_SECRET (or NEXTAUTH_SECRET) 환경 변수가 설정되어 있지 않습니다.");
	}

	const token = await getToken({
		req: request,
		secret,
		secureCookie,
		cookieName,
		salt,
	});

	const redirectToLogin = () => {
		const url = new URL("/member/login", origin);
		const redirect = searchParams.get("redirect") ?? pathname;
		url.searchParams.set("redirect", redirect);
		return NextResponse.redirect(url);
	};

	if (pathname.startsWith("/admin")) {
		if (!token) {
			return redirectToLogin();
		}
		if (token.role !== "admin") {
			return NextResponse.redirect(new URL("/", origin));
		}
	}

	if (pathname.startsWith("/parents")) {
		if (!token) {
			return redirectToLogin();
		}
		if (token.status !== "active") {
			const url = new URL("/member/login", origin);
			url.searchParams.set("status", typeof token.status === "string" ? token.status : "pending");
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/parents/:path*", "/admin/:path*"],
};
