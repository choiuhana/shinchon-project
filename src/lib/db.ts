import { sql } from "@vercel/postgres";

export const db = sql;

/**
 * Executes a lightweight query to verify database connectivity.
 * Useful for health checks and setup scripts.
 */
export async function pingDatabase(): Promise<boolean> {
	const { rows } = await db`SELECT 1 as result`;
	return rows[0]?.result === 1;
}

