import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "tests",
	globalSetup: "./tests/global-setup.ts",
	globalTeardown: "./tests/global-teardown.ts",
	timeout: 60_000,
	workers: 1,
	expect: {
		timeout: 7_000,
	},
	use: {
		baseURL: "http://localhost:3100",
		trace: "on-first-retry",
		video: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	webServer: {
		command: "npm run dev",
		url: "http://localhost:3100",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
};

export default config;
