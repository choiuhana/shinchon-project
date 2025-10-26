import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getParentClassPost } from "@/lib/data/class-posts-repository";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
	if (!date) return "";
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

type ParentPostDetailPageProps = {
	params: Promise<{ id: string }>;
};

export default async function ParentPostDetailPage({ params }: ParentPostDetailPageProps) {
	const session = await auth();
	if (!session?.user?.id) {
		redirect("/member/login?redirect=/parents/posts");
	}

	const { id } = await params;

	const post = await getParentClassPost(session.user.id, id);
	if (!post) {
		notFound();
	}

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="border-b border-[var(--border)] bg-white/85">
				<div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-12 sm:px-10 lg:px-12">
					<Badge variant="outline" className="w-fit">Class News</Badge>
					<div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
						<Link href="/parents" className="hover:text-[var(--brand-primary)]">
							대시보드
						</Link>
						<span>/</span>
						<Link href="/parents/posts" className="hover:text-[var(--brand-primary)]">
							반 소식
						</Link>
					</div>

					<h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] leading-tight">{post.title}</h1>
					<p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
						{post.classroomName ?? "반 미지정"} · {formatDate(post.publishAt ?? post.createdAt)}
					</p>
					{post.summary ? (
						<p className="text-base leading-relaxed text-muted-foreground">{post.summary}</p>
					) : null}
				</div>
			</section>

			<section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-12">
				<article className="space-y-6 text-base leading-loose text-muted-foreground">
					{post.content.map((paragraph, index) => (
						<p key={`${post.id}-paragraph-${index}`}>{paragraph}</p>
					))}
				</article>

				{post.attachments.length ? (
					<div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white/80 px-6 py-6 text-sm text-muted-foreground">
						<h3 className="font-semibold text-[var(--brand-navy)]">첨부 자료</h3>
						<ul className="mt-3 list-disc space-y-2 pl-4">
							{post.attachments.map((attachment) => (
								<li key={attachment.id}>
									<Link
										href={attachment.fileUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[var(--brand-primary)] underline-offset-4 hover:underline"
									>
										{attachment.label ?? "첨부"}
									</Link>
								</li>
							))}
						</ul>
					</div>
				) : null}

				<Button variant="ghost" size="sm" asChild className="w-fit">
					<Link href="/parents/posts">목록으로 돌아가기</Link>
				</Button>
			</section>
		</div>
	);
}
