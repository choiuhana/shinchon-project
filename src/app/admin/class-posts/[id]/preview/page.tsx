import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getClassPost } from "@/lib/data/class-posts-repository";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null) {
	if (!date) return "";
	return new Intl.DateTimeFormat("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

type AdminClassPostPreviewProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminClassPostPreview({ params }: AdminClassPostPreviewProps) {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		redirect("/member/login?redirect=/admin/class-posts");
	}

	const { id } = await params;
	const post = await getClassPost(id);
	if (!post) {
		notFound();
	}

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Preview</p>
					<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">{post.title}</h1>
					<p className="text-sm text-muted-foreground">
						{post.classroomName ?? "반 미지정"} · {formatDate(post.publishAt ?? post.createdAt)}
					</p>
				</div>
				<Button variant="outline" asChild>
					<Link href="/admin/class-posts">목록으로 돌아가기</Link>
				</Button>
			</div>

			<div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 px-6 py-8 shadow-[var(--shadow-soft)]">
				{post.summary ? (
					<p className="mb-6 text-base font-medium text-[var(--brand-navy)]">{post.summary}</p>
				) : null}
				<div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
					{post.content.map((paragraph, index) => (
						<p key={`${post.id}-paragraph-${index}`}>{paragraph}</p>
					))}
				</div>
			</div>

			{post.attachments.length ? (
				<div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/80 px-6 py-6 shadow-sm">
					<h2 className="text-sm font-semibold text-[var(--brand-navy)]">첨부 자료</h2>
					<ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-muted-foreground">
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

			<div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-white/70 px-4 py-4 text-xs text-muted-foreground">
				관리자 프리뷰입니다. 학부모 포털에서는 자녀·반 연동 여부에 따라 접근이 제한됩니다.
			</div>
		</div>
	);
}
