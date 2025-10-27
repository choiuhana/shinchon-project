import { auth } from "@/lib/auth";

import { SiteHeaderClient } from "./site-header.client";

export async function SiteHeader() {
	const session = await auth();

	const isAdmin = session?.user?.role === "admin";
	const isAuthenticated = Boolean(session?.user?.id);

	return <SiteHeaderClient isAdmin={isAdmin} isAuthenticated={isAuthenticated} />;
}
