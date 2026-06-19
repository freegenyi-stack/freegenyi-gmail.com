import { test, expect } from "@playwright/test";

const locale = process.env.E2E_LOCALE || "DZ-fr";

test.describe("Espace parent — parcours public / auth", () => {
  test("routes parent protégées redirigent vers login", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/auth/login`));
  });

  test("page objectifs parent protégée", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/objectifs`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/auth/login`));
  });

  test("page atelier parent protégée", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/atelier`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/auth/login`));
  });

  test("redirection exercices → atelier geny", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/exercices`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/auth/login`));
  });

  test("page besoins enfant protégée", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/besoins`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/auth/login`));
  });

  test("export historique protégé", async ({ page }) => {
    const res = await page.request.get(`/api/parent/history/export?format=csv`);
    expect(res.status()).toBe(401);
  });

  test("boost vocal deep link vers messages", async ({ page }) => {
    await page.goto(
      `/${locale}/dashboard/messages?voice=1&boost=1&geny=1&childId=1&childName=Test`
    );
    await expect(page).toHaveURL(new RegExp(`/${locale}/auth/login`));
  });
});

test.describe("Espace parent — session authentifiée", () => {
  test("accueil parent charge", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("atelier unifié — onglet Geny", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/atelier?tab=geny`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /geny|pdf/i })).toBeVisible();
  });

  test("redirection printables → atelier geny", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/printables`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/dashboard/parent/atelier\\?tab=geny`));
  });

  test("navigation mobile atelier", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Test barre mobile uniquement");
    await page.goto(`/${locale}/dashboard/parent`);
    await page.getByRole("link", { name: /atelier|ورشت/i }).first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/dashboard/parent/atelier`));
  });

  test("historique avec export", async ({ page }) => {
    await page.goto(`/${locale}/dashboard/parent/historique`);
    await expect(page.getByRole("link", { name: /export csv|تصدير csv/i })).toBeVisible();
  });
});
