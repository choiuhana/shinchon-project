import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClassPosts, getClassrooms } from "@/lib/data/class-posts-repository";

import { CreateClassPostForm } from "./_components/create-class-post-form";
import { DeleteClassPostButton } from "./_components/delete-class-post-button";

export const dynamic = "force-dynamic";

export default async function AdminClassPostsPage() {
	const [classrooms, posts] = await Promise.all([getClassrooms(), getClassPosts({ limit: 100 })]);

	return (
		<div className="bg-[var(--background)] text-[var(--brand-navy)]">
			<section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-12">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-[var(--brand-secondary)]">Admin Console</p>
							<h1 className="font-heading text-[clamp(2rem,3vw,2.75rem)] leading-tight">반 소식 관리</h1>
							<p className="text-sm text-muted-foreground">학급별 소식을 작성하고 첨부 자료를 추가해 학부모 포털에 공유합니다.</p>
						</div>
						<Button variant="outline" asChild>
							<Link href="/admin">← 관리자 홈으로</Link>
						</Button>
					</div>

					<CreateClassPostForm classrooms={classrooms} />
				</div>

				<section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)]">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-semibold">등록된 반 소식</h2>
							<p className="text-sm text-muted-foreground">최신 순으로 정렬됩니다. 학부모 포털과 학급별 페이지에 노출됩니다.</p>
						</div>
						<Badge variant="outline">총 {posts.length}건</Badge>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>반</TableHead>
								<TableHead>제목</TableHead>
								<TableHead>요약</TableHead>
								<TableHead>게시일</TableHead>
								<TableHead className="text-right">관리</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{posts.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
										등록된 게시글이 없습니다.
									</TableCell>
								</TableRow>
							) : (
								posts.map((post) => (
									<TableRow key={post.id}>
										<TableCell>{post.classroomName ?? "반 미지정"}</TableCell>
										<TableCell className="font-semibold">{post.title}</TableCell>
										<TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
											{post.summary ?? post.content[0]}
										</TableCell>
										<TableCell className="text-sm">{post.publishAt ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(post.publishAt) : "-"}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button variant="outline" size="sm" asChild>
													<Link href={`/parents/posts/${post.id}`} target="_blank">
														미리보기
													</Link>
												</Button>
												<DeleteClassPostButton postId={post.id} />
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
						<TableCaption>삭제 시 학부모 포털에서도 사라집니다.</TableCaption>
					</Table>
				</section>
			</section>
		</div>
	);
}
