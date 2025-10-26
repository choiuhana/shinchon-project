import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getParentClassPosts } from "@/lib/data/class-posts-repository";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
	if (!date) return "";
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

export default async function ParentPostsPage() {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/member/login?redirect=/parents/posts");
	}

	const posts = await getParentClassPosts(session.user.id, 40);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:px-10 lg:px-12">
					<Badge variant="outline" className="w-fit">
						Class News
					</Badge>
					<h1 className="font-heading text-[clamp(2rem,4vw,3rem)] leading-tight">반 소식 전체 보기</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						아이 반에서 올라온 소식을 한 페이지에서 확인하세요. 첨부된 안내문과 사진은 새 창으로 열립니다.
					</p>
				</div>
			</section>

			<section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:px-10 lg:px-12">
				{posts.length === 0 ? (
					<p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-4 py-12 text-center text-sm text-muted-foreground">
						등록된 소식이 없습니다.
					</p>
				) : (
					<div className="grid gap-4">
						{posts.map((post) => (
							<Card key={post.id} className="border-[var(--border)] bg-white/90">
								<CardHeader className="space-y-3">
									<CardDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
										{post.classroomName ?? "반 미지정"} · {formatDate(post.publishAt ?? post.createdAt)}
									</CardDescription>
									<CardTitle className="text-lg text-[var(--brand-navy)]">{post.title}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3 text-sm text-muted-foreground">
									<p>{post.summary ?? post.content[0]}</p>
									<Button variant="link" className="px-0 text-[var(--brand-primary)]" asChild>
										<Link href={`/parents/posts/${post.id}`}>자세히 보기</Link>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
