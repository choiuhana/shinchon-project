import { defineConfig } from "drizzle-kit";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envFile = [".env.local", ".env"].find((file) => existsSync(resolve(process.cwd(), file)));
if (envFile) {
	const content = readFileSync(resolve(process.cwd(), envFile), "utf8");
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const [key, ...rest] = trimmed.split("=");
		const value = rest.join("=").trim();
		if (key && !(key in process.env)) {
			process.env[key] = value;
		}
	}
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
