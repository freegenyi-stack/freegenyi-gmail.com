import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const locale = process.env.E2E_LOCALE || "DZ-fr";
const authFile = path.join(__dirname, ".auth", "parent.json");

setup("authenticate parent", async ({ page }) => {
  setup.skip(!process.env.E2E_PARENT_EMAIL, "Définir E2E_PARENT_EMAIL et E2E_PARENT_PASSWORD");

  const email = process.env.E2E_PARENT_EMAIL!;
  const password = process.env.E2E_PARENT_PASSWORD!;

  await page.goto(`/${locale}/auth/login`);
  await page.getByLabel(/e-mail|email|بريد/i).fill(email);
  await page.getByLabel(/mot de passe|password|كلمة/i).fill(password);
  await page.getByRole("button", { name: /connexion|connecter|login|sign in|دخول/i }).click();
  await page.waitForURL(new RegExp(`/${locale}/dashboard`), { timeout: 45_000 });
  await expect(page).not.toHaveURL(new RegExp(`/${locale}/auth/login`));

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
