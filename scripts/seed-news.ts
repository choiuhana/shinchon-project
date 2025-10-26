import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config } from "dotenv";
import { db } from "@/lib/db";

const envFile = [".env.local", ".env"].find((file) => existsSync(resolve(process.cwd(), file)));
if (envFile) {
	config({ path: envFile });
}

type LegacyEntry = {
	title: string;
	url: string;
	textSnippet?: string;
	images?: string[];
};

type LegacyDataset = {
	notice: LegacyEntry[];
	correspondence: LegacyEntry[];
	monthlyEvents: LegacyEntry[];
};

const legacyData: LegacyDataset = {
	notice: [
		{
			title: "2026학년도 신촌유치원 입학설명회",
			url: "https://www.shinchonkid.com/web/customer/notice_view.html?no=184",
			textSnippet:
				"2026학년도 신촌유치원 입학설명회를 다음과 같이 개최합니다. 아래 입학설명회 포스터에 있는 QR코드 또는 네이버폼 링크 https://naver.me/5tfNnVEf 를 통해 신청해주세요^^",
			images: ["http://www.shinchonkid.com/web/upload/1759389487_344067.jpg"],
		},
		{
			title: "2024학년도 신촌유치원 결산서",
			url: "https://www.shinchonkid.com/web/customer/notice_view.html?no=182",
			textSnippet: "2024학년도 신촌유치원 결산서를 붙임과 같이 공개합니다.",
		},
		{
			title: "2025년 4월 식단",
			url: "https://www.shinchonkid.com/web/customer/notice_view.html?no=181",
			images: [
				"http://www.shinchonkid.com/web/upload/1743580441_931293.jpg",
				"http://www.shinchonkid.com/web/upload/1743580451_735374.jpg",
			],
		},
		{
			title: "2024학년도 하반기 급식비 중 식품비 사용 비율",
			url: "https://www.shinchonkid.com/web/customer/notice_view.html?no=180",
			textSnippet: "2024학년도 하반기 급식비 중 식품비 사용 비율입니다.",
		},
		{
			title: "2024 유치원 자체평가 결과 보고서",
			url: "https://www.shinchonkid.com/web/customer/notice_view.html?no=179",
			images: [
				"http://www.shinchonkid.com/web/upload/1742888084_096720.jpg",
				"http://www.shinchonkid.com/web/upload/1742888182_895500.jpg",
			],
		},
	],
	correspondence: [
		{
			title: "10월 가정통신문-10월3주",
			url: "https://www.shinchonkid.com/web/customer/correspondence_view.html?no=581",
			images: [
				"http://www.shinchonkid.com/web/upload/1760685910_455750.jpg",
				"http://www.shinchonkid.com/web/upload/1760685916_284677.jpg",
			],
		},
		{
			title: "10월 가정통신문-10월2주",
			url: "https://www.shinchonkid.com/web/customer/correspondence_view.html?no=580",
			images: [
				"http://www.shinchonkid.com/web/upload/1759393155_027558.jpg",
				"http://www.shinchonkid.com/web/upload/1759393160_161442.jpg",
			],
		},
		{
			title: "10월 가정통신문-10월1주",
			url: "https://www.shinchonkid.com/web/customer/correspondence_view.html?no=579",
			images: [
				"http://www.shinchonkid.com/web/upload/1758872926_681268.jpg",
				"http://www.shinchonkid.com/web/upload/1758872932_597075.jpg",
			],
		},
		{
			title: "9월 가정통신문-9월4주",
			url: "https://www.shinchonkid.com/web/customer/correspondence_view.html?no=578",
			images: [
				"http://www.shinchonkid.com/web/upload/1758270754_591441.jpg",
				"http://www.shinchonkid.com/web/upload/1758270761_172037.jpg",
			],
		},
		{
			title: "9월 가정통신문-9월3주",
			url: "https://www.shinchonkid.com/web/customer/correspondence_view.html?no=577",
			images: ["http://www.shinchonkid.com/web/upload/1757665293_768649.jpg"],
		},
	],
	monthlyEvents: [
		{
			title: "다문화교육(필리핀)",
			url: "https://www.shinchonkid.com/web/customer/month_view.html?no=1217",
			textSnippet: "-",
		},
	],
};

function slugify(input: string) {
	return input
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function buildContent(text?: string) {
	if (!text || text.trim().length === 0 || text.trim() === "-") {
		return JSON.stringify(["첨부 이미지를 참고해 주세요."]);
	}

	const normalized = text
		.replace(/https?:\/\/\S+/g, (url) => `(${url})`)
		.replace(/\s+/g, " ")
		.trim();

	const paragraphs = normalized
		.split(/(?<=[.!?])\s+/)
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph.length > 0);

	return JSON.stringify(paragraphs.length > 0 ? paragraphs : [normalized]);
}

function buildSummary(entry: LegacyEntry) {
	if (entry.textSnippet && entry.textSnippet.trim().length > 0 && entry.textSnippet.trim() !== "-") {
		return entry.textSnippet.trim().slice(0, 140);
	}
	return `${entry.title} 자료를 확인해 주세요.`;
}

async function upsertPost(entry: LegacyEntry, category: "announcements" | "newsletter" | "events") {
	const slugBase = slugify(entry.title);
	const slug = slugBase.length > 0 ? slugBase : `post-${Date.now()}`;
	const summary = buildSummary(entry);
	const content = buildContent(entry.textSnippet);
	const heroImageUrl = entry.images?.[0] ?? null;
	const publishAt = new Date();

	const inserted = await db`
		INSERT INTO news_posts (
			slug,
			title,
			category,
			summary,
			content,
			hero_image_url,
			hero_image_alt,
			publish_at,
			is_highlighted,
			audience_scope,
			created_by
		) VALUES (
			${slug},
			${entry.title},
			${category},
			${summary},
			${content},
			${heroImageUrl},
			null,
			${publishAt.toISOString()},
			false,
			${category === "newsletter" ? "parents" : "public"},
			null
		)
		ON CONFLICT (slug) DO UPDATE SET
			title = EXCLUDED.title,
			category = EXCLUDED.category,
			summary = EXCLUDED.summary,
			content = EXCLUDED.content,
			hero_image_url = EXCLUDED.hero_image_url,
			publish_at = EXCLUDED.publish_at,
			updated_at = NOW()
		RETURNING id
	`;

	const postId = inserted.rows[0]?.id as string | undefined;

	if (!postId) {
		throw new Error(`게시글 저장에 실패했습니다: ${entry.title}`);
	}

	await db`DELETE FROM news_attachments WHERE post_id = ${postId}`;

	const attachmentImages = entry.images ?? [];
	const attachments = heroImageUrl ? attachmentImages.slice(1) : attachmentImages;

	for (const [index, url] of attachments.entries()) {
		if (!url) continue;
		await db`
			INSERT INTO news_attachments (post_id, file_url, label)
			VALUES (${postId}, ${url}, ${index === 0 ? "추가 이미지" : `첨부 ${index + 1}`})
		`;
	}
}

async function seedLegacyNews() {
	console.log("🔄 Seeding legacy news data...");

	for (const entry of legacyData.notice) {
		await upsertPost(entry, "announcements");
		console.log(`• 공지사항: ${entry.title}`);
	}

	for (const entry of legacyData.correspondence) {
		await upsertPost(entry, "newsletter");
		console.log(`• 가정통신문: ${entry.title}`);
	}

	for (const entry of legacyData.monthlyEvents) {
		await upsertPost(entry, "events");
		console.log(`• 월별행사: ${entry.title}`);
	}

	console.log("✅ Legacy news seeding completed.");
}

seedLegacyNews()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error("❌ Failed to seed legacy news", error);
		process.exit(1);
	});
