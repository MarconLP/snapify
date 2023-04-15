import { expect, test } from "@playwright/test";

test.describe("video", () => {
  test("should be able to view video", async ({ page }) => {
    await page.goto("http://localhost:3000/videos");
    await page.locator("div.grid > a:nth-child(1)").click();
    await expect(page).toHaveURL(
      /http:\/\/localhost:3000\/share\/[A-Za-z0-9]+/
    );

    const video = page.locator("video");
    expect(video).toBeTruthy();
    await video.evaluate((v: HTMLVideoElement) => v.play());
    const isPlaying = await video.evaluate((v: HTMLVideoElement) => !v.paused);
    expect(isPlaying).toBe(true);
    await video.click();
    const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
    expect(isPaused).toBe(true);
  });

  test("should be able to rename video", async ({ page }) => {
    const randomTitle = "Random title " + Math.random().toString();

    await page.goto("http://localhost:3000/videos");
    await page.locator("div.grid > a:nth-child(1)").click();
    await expect(page).toHaveURL(
      /http:\/\/localhost:3000\/share\/[A-Za-z0-9]+/
    );

    await page.locator("button > svg").click();
    await page.getByText("Rename").click();
    await page.click("#title");
    await page.fill("#title", randomTitle);
    await page.getByText("Save").click();
    expect(
      await page.locator("div > span.text-lg.font-medium").textContent()
    ).toBe(randomTitle);
  });

  test("should be able to share video", async ({ page }) => {
    await page.goto("http://localhost:3000/videos");
    await page.locator("div.grid > a:nth-child(1)").click();
    await expect(page).toHaveURL(
      /http:\/\/localhost:3000\/share\/[A-Za-z0-9]+/
    );

    await page.getByText("Share").click();
    await page.locator('div.mt-6 > button[role="switch"]').click();
  });
});
