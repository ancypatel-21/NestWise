import { test, expect, type Page } from "@playwright/test";

/**
 * Critical journeys from PRD §60. Journeys 1, 4, 5 and 6 are implemented; the rest are
 * scaffolded as `test.fixme` with the intended steps.
 */

async function signup(page: Page, email: string) {
  await page.goto("/signup");
  await page.getByLabel("Your name").fill("Test Parent");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("nestwise123");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/onboarding");
}

test("Journey 1 — new expecting mother onboarding reaches a week-aware dashboard", async ({
  page,
}) => {
  await signup(page, `mother+${Date.now()}@nestwise.test`);

  await page.getByRole("button", { name: "We are expecting a baby" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Mother", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "I know my current week" }).click();
  await page.getByLabel("Current pregnancy week").fill("18");
  await expect(page.getByText(/approximately 4 months/i)).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Finish" }).click();

  await page.waitForURL("**/home");
  await expect(page.getByText(/18 weeks/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Open week 18/i })).toBeVisible();
});

test("Journey 4 — a personal symptom question returns a Level 2 cautious answer", async ({
  page,
}) => {
  await signup(page, `symptom+${Date.now()}@nestwise.test`);
  await page.getByRole("button", { name: "We are expecting a baby" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Mother", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I know my current week" }).click();
  await page.getByLabel("Current pregnancy week").fill("20");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Finish" }).click();
  await page.waitForURL("**/home");

  await page.goto("/ask");
  await page.getByLabel("Your question").fill("I have been vomiting all day, should I worry?");
  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText(/midwife|doctor|provider|professional/i).first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText(/Sources/i).first()).toBeVisible();
});

test("Journey 5 — hospital-bag checklist reaches 100%", async ({ page }) => {
  await signup(page, `bag+${Date.now()}@nestwise.test`);
  await page.getByRole("button", { name: "We are expecting a baby" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Mother", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I know my current week" }).click();
  await page.getByLabel("Current pregnancy week").fill("38");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Finish" }).click();
  await page.waitForURL("**/home");

  await page.goto("/birth/hospital-bag");
  const boxes = page.getByRole("checkbox");
  const count = await boxes.count();
  for (let i = 0; i < count; i++) {
    const box = boxes.nth(i);
    if (!(await box.isChecked())) await box.check();
  }
  await expect(page.getByText("100%").first()).toBeVisible();
});

test("Journey 6 — adding a child moves the family into child mode", async ({ page }) => {
  await signup(page, `arrival+${Date.now()}@nestwise.test`);
  await page.getByRole("button", { name: "We are expecting a baby" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Mother", exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I know my current week" }).click();
  await page.getByLabel("Current pregnancy week").fill("30");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Finish" }).click();
  await page.waitForURL("**/home");

  await page.goto("/settings/family");
  await page.getByLabel("Name or nickname").fill("Poppy");
  await page.getByLabel("Date of birth").fill("2026-08-01");
  await page.getByRole("button", { name: "Add child" }).click();

  await page.goto("/child");
  await expect(page.getByText(/Poppy/).first()).toBeVisible();
});

// --- Scaffolded (PRD §60) ---
test.fixme("Journey 2 — new partner onboarding surfaces partner-specific guidance", async () => {});
test.fixme("Journey 3 — week-specific learning: open a week, read a lesson, mark complete", async () => {});
test.fixme("Journey 7 — child plays a learning game and it appears in progress", async () => {});
test.fixme("Journey 8 — kid mode blocks adult health routes", async () => {});
