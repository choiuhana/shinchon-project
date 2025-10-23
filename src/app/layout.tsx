import type { Metadata } from "next";
import { Architects_Daughter, Kanit } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const kanit = Kanit({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-body",
	display: "swap",
});

const architectsDaughter = Architects_Daughter({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-accent",
	display: "swap",
});

export const metadata: Metadata = {
	title: "신촌몬테소리유치원",
	description:
		"아이의 하루가 반짝이는 신촌몬테소리유치원의 교육 프로그램, 입학 안내, 학부모 소통 공간을 소개합니다.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={`${kanit.variable} ${architectsDaughter.variable} antialiased`}>
				<div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--brand-navy)]">
					<SiteHeader />
					<main className="flex-1">{children}</main>
					<SiteFooter />
				</div>
			</body>
		</html>
	);
}
