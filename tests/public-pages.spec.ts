import { expect, test } from "@playwright/test";

test.describe("공개 페이지", () => {
	test("메인 페이지를 정상적으로 로드한다", async ({ page }) => {
		const response = await page.goto("/");
		expect(response?.ok(), "홈페이지 응답 상태가 200이어야 합니다.").toBeTruthy();
		await expect(page.getByRole("heading", { name: "신촌몬테소리유치원" })).toBeVisible();
	});

	test("로그인 페이지에서 폼 요소를 확인한다", async ({ page }) => {
		await page.goto("/member/login");

		await expect(page.getByRole("heading", { name: "신촌몬테소리 로그인" })).toBeVisible();
		await expect(page.getByLabel("이메일")).toBeVisible();
		await expect(page.getByLabel("비밀번호")).toBeVisible();
		await expect(page.getByRole("button", { name: "로그인" })).toBeEnabled();
	});

	test("로그인 없이 학부모 포털 접근 시 로그인 페이지로 리디렉트된다", async ({ page }) => {
		await page.goto("/parents");

		await expect(page).toHaveURL(/\/member\/login\?redirect=%2Fparents/);
		await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
	});
});
