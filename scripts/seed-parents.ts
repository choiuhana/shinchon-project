import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config } from "dotenv";
import { db } from "@/lib/db";

const envFile = [".env.local", ".env"].find((file) => existsSync(resolve(process.cwd(), file)));
if (envFile) {
	config({ path: envFile });
}

async function seedParents() {
	console.log("🔄 Seeding classrooms/children...");

	const classroomRows: { id: string; name: string }[] = [];
	const targetClassrooms = [
		{ name: "Petit A (만3세)", description: "첫 등원 적응반", age: "만3세", lead: "김하늘", assistant: "이세온" },
		{ name: "Prime B (만4세)", description: "융합 프로젝트 반", age: "만4세", lead: "박가온", assistant: "정다빈" },
	];

	for (const classroom of targetClassrooms) {
		const existing = await db`SELECT id FROM classrooms WHERE name = ${classroom.name}`;
		if (existing.rows.length > 0) {
			classroomRows.push({ id: existing.rows[0].id, name: classroom.name });
			await db`
				UPDATE classrooms
				SET description = ${classroom.description},
					age_range = ${classroom.age},
					lead_teacher = ${classroom.lead},
					assistant_teacher = ${classroom.assistant},
					updated_at = now()
				WHERE id = ${existing.rows[0].id}
			`;
		} else {
			const inserted = await db`
				INSERT INTO classrooms (name, description, age_range, lead_teacher, assistant_teacher)
				VALUES (${classroom.name}, ${classroom.description}, ${classroom.age}, ${classroom.lead}, ${classroom.assistant})
				RETURNING id, name
			`;
			classroomRows.push(inserted.rows[0] as { id: string; name: string });
		}
	}

	const petitId = classroomRows.find((row) => row.name.includes("Petit"))?.id;
	const primeId = classroomRows.find((row) => row.name.includes("Prime"))?.id;

	const childRows: { id: string; name: string }[] = [];
const targetChildren = [
		{ name: "김솔", classroomId: petitId },
		{ name: "박하윤", classroomId: primeId },
	];

	for (const child of targetChildren) {
		const existingChild = await db`SELECT id FROM children WHERE name = ${child.name}`;
		if (existingChild.rows.length > 0) {
			childRows.push({ id: existingChild.rows[0].id, name: child.name });
			await db`
				UPDATE children SET classroom_id = ${child.classroomId}, updated_at = now() WHERE id = ${existingChild.rows[0].id}
			`;
		} else if (child.classroomId) {
			const insertedChild = await db`
				INSERT INTO children (classroom_id, name, status)
				VALUES (${child.classroomId}, ${child.name}, 'active')
				RETURNING id, name
			`;
			childRows.push(insertedChild.rows[0] as { id: string; name: string });
		}
	}

	const [parent] = (await db`SELECT id FROM users WHERE email = 'parent-active@playwright.test'`).rows;
const [admin] = (await db`SELECT id FROM users WHERE email = 'admin@playwright.test'`).rows;

	if (parent) {
		for (const child of childRows) {
			await db`
				INSERT INTO child_parents (child_id, parent_id, relationship, primary_contact)
				VALUES (${child.id}, ${parent.id}, 'mother', true)
				ON CONFLICT DO NOTHING
			`;
		}
	}

	const classPostSeeds = [
		{
			title: "10월 주간 프로젝트 안내",
			summary: "나무와 가을 잎을 주제로 한 주간 프로젝트 안내",
			content: [
				"이번 주 Petit A 반은 '가을 숲 관찰' 프로젝트를 진행합니다.",
				"월요일에는 교실에서 낙엽과 열매를 탐색하고, 수요일에는 야외 관찰을 진행합니다.",
				"금요일에는 부모님과 함께하는 작은 전시 시간을 가질 예정입니다.",
			],
			classroomId: petitId,
			attachments: [
				{
					label: "가정 안내문",
					url: "http://www.shinchonkid.com/web/upload/parent-letter-1014.jpg",
				},
			],
		},
		{
			title: "Prime B 11월 일정",
			summary: "11월 통합 프로젝트와 생일파티 일정",
			content: [
				"11월에는 '우리 몸 탐험' 프로젝트를 진행하며, 금요일마다 실험 활동이 진행됩니다.",
				"11/15에는 4세 생일파티가 있으니 간단한 간식을 준비해 주세요.",
			],
			classroomId: primeId,
			attachments: [],
		},
	];

	for (const post of classPostSeeds) {
		if (!post.classroomId) continue;
		const contentJson = JSON.stringify(post.content);
		const existingPost = await db`
			SELECT id FROM class_posts WHERE title = ${post.title} AND classroom_id = ${post.classroomId}
		`;

		let postId = existingPost.rows[0]?.id as string | undefined;

		if (postId) {
			await db`
				UPDATE class_posts
				SET summary = ${post.summary},
					content = ${contentJson},
					publish_at = now(),
					updated_at = now()
				WHERE id = ${postId}
			`;
		} else {
			const insertedPost = await db`
				INSERT INTO class_posts (classroom_id, author_id, title, summary, content, publish_at)
				VALUES (${post.classroomId}, ${admin?.id ?? null}, ${post.title}, ${post.summary}, ${contentJson}, now())
				RETURNING id
			`;
			postId = insertedPost.rows[0]?.id as string;
		}

		if (!postId) continue;

		await db`DELETE FROM class_post_attachments WHERE post_id = ${postId}`;

		for (const attachment of post.attachments) {
			await db`
				INSERT INTO class_post_attachments (post_id, file_url, label)
				VALUES (${postId}, ${attachment.url}, ${attachment.label ?? null})
			`;
		}
	}

	const scheduleSeeds = [
		{
			title: "11월 방문 수업",
			description: "보호자 초청 공개수업",
			classroomId: petitId,
			startDate: new Date(Date.UTC(2025, 10, 14, 1, 0)),
			endDate: new Date(Date.UTC(2025, 10, 14, 3, 0)),
			location: "Petit A 교실",
		},
		{
			title: "정기 운영위원회",
			description: "11월 운영위원회 정기 회의",
			classroomId: null,
			startDate: new Date(Date.UTC(2025, 10, 20, 2, 0)),
			endDate: new Date(Date.UTC(2025, 10, 20, 3, 0)),
			location: "본관 2층 회의실",
		},
	];

	for (const schedule of scheduleSeeds) {
		const existingSchedule = await db`
			SELECT id FROM class_schedules WHERE title = ${schedule.title} AND start_date = ${schedule.startDate.toISOString()}
		`;
		if (existingSchedule.rows.length > 0) {
			await db`
				UPDATE class_schedules
				SET description = ${schedule.description ?? null},
					classroom_id = ${schedule.classroomId ?? null},
					end_date = ${schedule.endDate?.toISOString() ?? null},
					location = ${schedule.location ?? null},
					updated_at = now()
				WHERE id = ${existingSchedule.rows[0].id}
			`;
		} else {
			await db`
				INSERT INTO class_schedules (classroom_id, title, description, start_date, end_date, location)
				VALUES (${schedule.classroomId ?? null}, ${schedule.title}, ${schedule.description ?? null}, ${schedule.startDate.toISOString()}, ${schedule.endDate?.toISOString() ?? null}, ${schedule.location ?? null})
			`;
		}
	}

	console.log("✅ Parent seed complete");
}

seedParents()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
