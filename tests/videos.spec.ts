import { test, expect } from "@playwright/test";

test("should be able to view videos", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("link", { name: "Go to Videos → The entire videos collection" })
    .click();
  await expect(page).toHaveURL("http://localhost:3000/videos");
});

test("no videos should exist", async ({ page }) => {
  await page.goto("http://localhost:3000/videos");
  await expect(page.locator("div.flex-start > div > span")).toContainText(
    "You do not have any recordings."
  );
});
