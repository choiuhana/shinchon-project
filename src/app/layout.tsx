import type { Metadata } from "next";
import { Architects_Daughter, Kanit } from "next/font/google";
import "./globals.css";

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
				{children}
			</body>
		</html>
	);
}
