import Link from "next/link";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const quickInfo = [
	{
		title: "입학 상담",
		description: "온라인으로 손쉽게 상담 예약을 남기고, 담당 교사가 24시간 이내에 연락드립니다.",
		action: "상담 예약하기",
		href: "#admission-consult",
	},
	{
		title: "캠퍼스 투어",
		description: "교실·실외놀이 공간을 직접 둘러볼 수 있는 30분 투어를 평일 오후에 운영합니다.",
		action: "투어 신청",
		href: "#campus-tour",
	},
	{
		title: "교육 프로그램",
		description: "몬테소리 · 자연생태 · 창의예술 융합 수업으로 아이의 잠재력을 키워요.",
		action: "프로그램 보기",
		href: "#programs",
	},
];

const programTabs = [
	{
		value: "montessori",
		label: "몬테소리",
		summary:
			"감각 교구를 활용한 집중 활동으로 스스로 학습하고 성장하는 힘을 길러줍니다.",
		points: ["교구 기반 감각 교육", "자율·책임 중심 일과", "개인 맞춤 관찰기록"],
	},
	{
		value: "nature",
		label: "생태 체험",
		summary:
			"텃밭 가꾸기, 숲 체험 등 자연 속에서 오감과 호기심을 키우는 프로젝트 수업입니다.",
		points: ["주 1회 숲 체험", "계절별 생태 프로젝트", "환경 감수성 교육"],
	},
	{
		value: "bilingual",
		label: "이중언어",
		summary:
			"놀이 중심 영어 환경으로 자연스럽게 의사소통 능력을 기르는 듀얼 러닝 프로그램.",
		points: ["영어 몰입 스토리 타임", "원어민 교사 상주", "음악·미술 융합 활동"],
	},
];

const noticeRows = [
	{
		title: "2025학년도 2분기 입학 설명회 안내",
		category: "입학",
		date: "2025-11-05",
	},
	{
		title: "11월 생태 체험 수업 안내",
		category: "프로그램",
		date: "2025-10-27",
	},
	{
		title: "학부모-교사 1:1 상담 주간",
		category: "소통",
		date: "2025-10-15",
	},
];

export default function StyleguidePage() {
	return (
		<div className="space-y-20 pb-24">
			<section className="rounded-[48px] bg-gradient-to-r from-sky-100 via-amber-100 to-rose-100 px-12 py-16 shadow-sm">
				<div className="flex flex-col gap-6 text-slate-900">
					<Badge className="w-fit bg-white/80 px-3 py-1 text-sm font-medium text-sky-700">
						아이의 하루가 반짝이는 곳
					</Badge>
					<h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
						신촌몬테소리유치원과 함께 성장하는
						<br className="hidden md:block" /> 아이의 상상력과 배움
					</h1>
					<p className="max-w-2xl text-lg text-slate-700">
						아이 한 명 한 명의 호기심을 지켜주기 위해 생활·놀이·프로젝트가 자연스럽게 연결된
						몬테소리·생태·이중언어 융합 커리큘럼을 운영합니다.
					</p>
					<div className="flex flex-wrap gap-3">
						<Button size="lg" asChild>
							<Link href="#admission-consult">입학 상담 신청</Link>
						</Button>
						<Button variant="secondary" size="lg" className="bg-white/80 text-slate-900 hover:bg-white">
							<Link href="#campus-tour">캠퍼스 투어 예약</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="space-y-8" id="quick-links">
				<header className="max-w-2xl space-y-3">
					<h2 className="text-3xl font-semibold text-slate-900">한눈에 보는 핵심 정보</h2>
					<p className="text-slate-600">
						가장 많이 찾는 정보와 서비스 흐름을 카드형으로 배치해 모바일에서도 빠르게 접근할
						수 있도록 구성합니다.
					</p>
				</header>
				<div className="grid gap-6 md:grid-cols-3">
					{quickInfo.map((item) => (
						<Card key={item.title} className="h-full border-none bg-white shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)]">
							<CardHeader className="space-y-2">
								<CardTitle className="text-xl text-slate-900">{item.title}</CardTitle>
								<CardDescription className="text-slate-600">{item.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="link" asChild className="px-0 text-sky-600">
									<Link href={item.href}>{item.action} →</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="space-y-8" id="programs">
				<header className="max-w-2xl space-y-3">
					<h2 className="text-3xl font-semibold text-slate-900">교육 프로그램 미리보기</h2>
					<p className="text-slate-600">
						Tabs 컴포넌트를 활용해 핵심 커리큘럼을 탐색할 수 있는 인터랙션을 제공합니다. 각 탭의
						내용은 상세 페이지와 연동됩니다.
					</p>
				</header>
				<Tabs defaultValue={programTabs[0]?.value} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
					<TabsList className="grid w-full grid-cols-1 gap-2 bg-transparent text-base md:grid-cols-3">
						{programTabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="rounded-full border border-transparent bg-slate-100 px-6 py-3 text-slate-700 data-[state=active]:border-sky-200 data-[state=active]:bg-sky-50 data-[state=active]:font-semibold data-[state=active]:text-sky-700"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
					{programTabs.map((tab) => (
						<TabsContent key={tab.value} value={tab.value} className="space-y-4 bg-white">
							<Card className="border-none bg-sky-50/60">
								<CardHeader>
									<CardTitle className="text-2xl font-semibold text-slate-900">{tab.label} 프로그램</CardTitle>
									<CardDescription className="text-slate-700">{tab.summary}</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="grid gap-2 text-slate-700 md:grid-cols-2">
										{tab.points.map((point) => (
											<li key={point} className="flex items-start gap-2">
												<span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
												<span>{point}</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</TabsContent>
					))}
				</Tabs>
			</section>

			<section className="space-y-8" id="notice-preview">
				<header className="max-w-2xl space-y-3">
					<h2 className="text-3xl font-semibold text-slate-900">알림마당 미리보기</h2>
					<p className="text-slate-600">
						Table 컴포넌트는 공지·가정통신문·행사 등 게시판 목록에 사용됩니다. 상태 배지는 카테고리
						컬러로 구분하여 가독성을 높입니다.
					</p>
				</header>
				<Table>
					<TableCaption>최근 등록된 알림</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>제목</TableHead>
							<TableHead>분류</TableHead>
							<TableHead className="text-right">게시일</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{noticeRows.map((row) => (
							<TableRow key={row.title}>
								<TableCell className="font-medium text-slate-800">{row.title}</TableCell>
								<TableCell>
									<Badge variant="secondary" className="bg-sky-100 text-sky-700">
										{row.category}
									</Badge>
								</TableCell>
								<TableCell className="text-right text-slate-600">{row.date}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</section>

			<section className="space-y-8" id="admission-consult">
				<header className="max-w-2xl space-y-3">
					<h2 className="text-3xl font-semibold text-slate-900">입학 상담 폼 예시</h2>
					<p className="text-slate-600">
						shadcn 폼 컴포넌트를 조합해 상담 신청 섹션을 구성합니다. 실제 구현 시에는 필수값 검증,
						전송 성공 메시지를 연결합니다.
					</p>
				</header>
				<Card className="border-none bg-white shadow-sm">
					<CardHeader>
						<CardTitle className="text-xl font-semibold text-slate-900">바로 상담 신청하기</CardTitle>
						<CardDescription className="text-slate-600">
							연락 가능한 시간을 남겨주시면 24시간 이내로 담당 교사가 연락드립니다.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="parent-name">보호자 성함</Label>
								<Input id="parent-name" placeholder="홍길동" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">연락처</Label>
								<Input id="phone" placeholder="010-1234-5678" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="child-name">자녀 이름</Label>
								<Input id="child-name" placeholder="홍아름" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="birth">생년월일</Label>
								<Input id="birth" type="date" />
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="message">문의 내용</Label>
							<Textarea
								id="message"
								rows={4}
								placeholder="궁금하신 내용을 자유롭게 남겨주세요. (예: 입학 상담 가능 일정, 프로그램 문의 등)"
							/>
						</div>
						<div className="flex flex-wrap items-center justify-between gap-4">
							<p className="text-sm text-slate-500">
								상담 신청 시 개인정보 처리방침에 동의한 것으로 간주됩니다.
							</p>
							<Button size="lg">상담 신청 보내기</Button>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
