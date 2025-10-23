import { NextResponse } from "next/server";

import { pingDatabase } from "@/lib/db";

export async function GET() {
	try {
		const databaseHealthy = await pingDatabase();

		return NextResponse.json({
			ok: true,
			database: databaseHealthy ? "reachable" : "unreachable",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Health endpoint failed", error);

		return NextResponse.json(
			{
				ok: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

