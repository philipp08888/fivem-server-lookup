import test, { expect } from "@playwright/test";

test("start page renders correctly", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FiveM Server Lookup/);

  const div = page.getByText("How To - Explanation");
  await expect(div).toBeVisible({ timeout: 40000 });
});
