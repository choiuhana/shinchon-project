import type { Metadata } from "next";
import { Fredoka, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const bodyFont = Noto_Sans_KR({
	variable: "--font-body",
	subsets: ["latin", "korean"],
	weight: ["400", "500", "700"],
	display: "swap",
});

const headingFont = Fredoka({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
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
			<body
				className={`${bodyFont.variable} ${headingFont.variable} font-sans antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
