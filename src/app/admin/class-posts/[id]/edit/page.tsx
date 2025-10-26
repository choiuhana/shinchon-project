import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getClassPost, getClassrooms } from "@/lib/data/class-posts-repository";
import { auth } from "@/lib/auth";

import { EditClassPostForm, type ClassPostFormValues } from "../../_components/create-class-post-form";

type EditClassPostPageProps = {
	params: Promise<{ id: string }>;
};

export default async function EditClassPostPage({ params }: EditClassPostPageProps) {
	const session = await auth();
	if (!session || session.user?.role !== "admin") {
		redirect("/member/login?redirect=/admin/class-posts");
	}

	const { id } = await params;
	const [classrooms, post] = await Promise.all([getClassrooms(), getClassPost(id)]);

	if (!post) {
		notFound();
	}

	const initialValues: ClassPostFormValues = {
		postId: post.id,
		classroomId: post.classroomId ?? "",
		title: post.title,
		summary: post.summary ?? "",
		publishAt: post.publishAt ? post.publishAt.toISOString() : null,
		contentMarkdown: post.content.join("\n\n"),
		attachments: post.attachments.map((attachment) => ({
			label: attachment.label ?? "",
			url: attachment.fileUrl,
		})),
	};

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12 sm:px-10 lg:px-12">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
						<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">반 소식 수정</h1>
						<p className="text-sm text-muted-foreground">학급별 공지/활동 소식을 수정하고 부모에게 빠르게 공유하세요.</p>
					</div>
					<Button variant="outline" asChild>
						<Link href="/admin/class-posts">← 목록으로 돌아가기</Link>
					</Button>
				</div>

				<EditClassPostForm classrooms={classrooms} initialValues={initialValues} />
			</section>
		</div>
	);
}
