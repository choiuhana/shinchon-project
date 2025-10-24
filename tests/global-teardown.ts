import { config as loadEnv } from "dotenv";
import { sql } from "@vercel/postgres";

const TEST_EMAILS = [
	"parent-active@playwright.test",
	"parent-pending@playwright.test",
	"admin@playwright.test",
];

export default async function globalTeardown() {
	loadEnv({ path: ".env.local" });

	if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL && !process.env.POSTGRES_URL_NON_POOLING) {
		return;
	}

	for (const email of TEST_EMAILS) {
		await sql`
			DELETE FROM users WHERE email = ${email}
		`;
	}
}
