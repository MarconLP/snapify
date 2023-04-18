import { test, expect } from "@playwright/test";

test.describe("videos", () => {
  // test("should be able to view videos", async ({ page }) => {
  //   await page.goto("http://localhost:3000/");
  //   await page
  //     .getByRole("link", {
  //       name: "Go to Videos → The entire videos collection",
  //     })
  //     .click();
  //   await expect(page).toHaveURL("http://localhost:3000/videos");
  // });

  test("no videos should exist", async ({ page }) => {
    await page.goto("http://localhost:3000/videos");
    await expect(page.locator("div.flex-start > div > span")).toContainText(
      "You do not have any recordings."
    );
  });

  test("can upload video", async ({ page }) => {
    await page.goto("http://localhost:3000/videos");
    await page.getByText("New video").click();
    await page
      .getByText("Drop files to Attach, or browse")
      .setInputFiles("tests/assets/example_video.webm");
    await page.getByRole("button", { name: "Upload" }).click();
    await expect(page).toHaveURL(
      /http:\/\/localhost:3000\/share\/[A-Za-z0-9]+/,
      {
        timeout: 30000,
      }
    );

    await page.click('[href="/videos"]');
    await page.getByText("example_video.webm").click();
    await expect(page).toHaveURL(
      /http:\/\/localhost:3000\/share\/[A-Za-z0-9]+/
    );
  });
});
