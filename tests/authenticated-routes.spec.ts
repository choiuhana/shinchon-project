import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function loginAs(
	page: Page,
	{
		email,
		password,
		redirect = "/parents",
	}: { email: string; password: string; redirect?: string },
) {
	const redirectParam = encodeURIComponent(redirect);
	await page.goto(`/member/login?redirect=${redirectParam}`);

	await page.getByLabel("이메일").fill(email);
	await page.getByLabel("비밀번호").fill(password);

	await page.getByRole("button", { name: "로그인" }).click();
	await page.waitForLoadState("networkidle");
}

test.describe("인증·권한 경로", () => {
	test.beforeEach(async ({ context }) => {
		await context.clearCookies();
	});

	test("활성 학부모 계정은 /parents 접근 가능", async ({ page }) => {
	await loginAs(page, {
		email: "parent-active@playwright.test",
		password: "Parent123!",
	});

	const cookies = await page.context().cookies();
	const sessionCookie = cookies.find((cookie) => cookie.name.includes("session-token"));
	expect(sessionCookie, "세션 쿠키가 설정되어 있어야 합니다.").toBeDefined();

	await page.goto("/parents");
	await expect(page).toHaveURL(/\/parents$/);
	await expect(page.getByRole("heading", { name: "등록된 자녀" })).toBeVisible();
	});

	test("승인 대기 학부모는 /parents 접근 시 로그인으로 되돌아가 안내 메시지를 확인한다", async ({ page }) => {
		await loginAs(page, {
			email: "parent-pending@playwright.test",
			password: "Parent123!",
		});

		await expect(page).toHaveURL(/\/member\/login\?status=pending/);
		await expect(page.getByText("관리자 승인 후 로그인하실 수 있습니다.")).toBeVisible();
	});

	test("로그인 없이 /admin 접근 시 로그인 페이지로 이동", async ({ page }) => {
		await page.goto("/admin");

		await expect(page).toHaveURL(/\/member\/login\?redirect=%2Fadmin/);
	});

	test("학부모 계정은 /admin 접근 시 홈페이지로 리디렉트", async ({ page }) => {
	await loginAs(page, {
		email: "parent-active@playwright.test",
		password: "Parent123!",
		redirect: "/admin",
	});

	await expect(page).toHaveURL(/http:\/\/(127\.0\.0\.1|localhost):3100\/?$/);
	});

	test("관리자 계정은 /admin 페이지에 접근 가능", async ({ page }) => {
		await loginAs(page, {
			email: "admin@playwright.test",
			password: "Admin123!",
			redirect: "/admin",
		});

		await expect(page).toHaveURL(/\/admin$/);
		await expect(page.getByRole("heading", { name: "콘텐츠 관리" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "게시글 작성" })).toBeVisible();
		await expect(page.getByText("등록된 게시글")).toBeVisible();
	});
});
