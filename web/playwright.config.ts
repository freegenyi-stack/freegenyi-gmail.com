import { defineConfig, devices } from "@playwright/test";
import path from "path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const authFile = path.join(__dirname, "e2e/.auth/parent.json");
const hasParentE2e = Boolean(process.env.E2E_PARENT_EMAIL?.trim() && process.env.E2E_PARENT_PASSWORD?.trim());

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    ...(hasParentE2e
      ? [
          {
            name: "parent-setup",
            testMatch: /parent-auth\.setup\.ts/,
          } as const,
        ]
      : []),
    {
      name: "parent-public",
      testMatch: /parent-space\.spec\.ts/,
      grepInvert: /session authentifiée/i,
    },
    ...(hasParentE2e
      ? [
          {
            name: "parent-auth",
            testMatch: /parent-space\.spec\.ts/,
            grep: /session authentifiée/i,
            dependencies: ["parent-setup"],
            use: {
              ...devices["Desktop Chrome"],
              storageState: authFile,
            },
          } as const,
        ]
      : []),
    {
      name: "chromium",
      testIgnore: [/parent-auth\.setup\.ts/, /parent-space\.spec\.ts/],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
