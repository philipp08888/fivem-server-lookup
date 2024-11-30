import test, { expect } from "@playwright/test";

test("start page renders correctly", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/How To - Explanation/);
});
