import { config as loadEnv } from "dotenv";
import { pbkdf2Sync, randomBytes } from "crypto";
import { sql } from "@vercel/postgres";

type TestUser = {
	name: string;
	email: string;
	password: string;
	role: "parent" | "admin";
	status: "active" | "pending";
};

const TEST_USERS: TestUser[] = [
	{
		name: "E2E Active Parent",
		email: "parent-active@playwright.test",
		password: "Parent123!",
		role: "parent",
		status: "active",
	},
	{
		name: "E2E Pending Parent",
		email: "parent-pending@playwright.test",
		password: "Parent123!",
		role: "parent",
		status: "pending",
	},
	{
		name: "E2E Admin",
		email: "admin@playwright.test",
		password: "Admin123!",
		role: "admin",
		status: "active",
	},
];

const SALT_BYTE_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 120_000;
const DIGEST = "sha512";

function hashPassword(password: string) {
	const salt = randomBytes(SALT_BYTE_LENGTH).toString("hex");
	const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");

	return `${ITERATIONS}:${salt}:${derivedKey}`;
}

async function ensureTestUsers() {
	const connectionString =
		process.env.POSTGRES_URL ??
		process.env.DATABASE_URL ??
		process.env.POSTGRES_URL_NON_POOLING ??
		process.env.POSTGRES_PRISMA_URL;

	if (!connectionString) {
		throw new Error("POSTGRES_URL (또는 DATABASE_URL) 환경 변수가 필요합니다.");
	}

	for (const user of TEST_USERS) {
		const hashedPassword = hashPassword(user.password);

		await sql`
			INSERT INTO users (name, email, password_hash, role, status)
			VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.role}, ${user.status})
			ON CONFLICT (email) DO UPDATE SET
				name = EXCLUDED.name,
				password_hash = EXCLUDED.password_hash,
				role = EXCLUDED.role,
				status = EXCLUDED.status,
				updated_at = now()
		`;
	}
}

export default async function globalSetup() {
	loadEnv({ path: ".env.local" });
	await ensureTestUsers();
}
